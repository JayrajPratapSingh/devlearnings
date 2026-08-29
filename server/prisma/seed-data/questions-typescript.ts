import type { SeedQuestion } from './questions';

/**
 * TypeScript interview questions, easy through hard.
 *
 * Ordered roughly by difficulty so the default listing reads as a ramp. The
 * recurring theme is the same one the topics build on: TypeScript is a checker
 * that erases itself, and most "surprising" behaviour follows from that.
 */
export const typescriptQuestions: SeedQuestion[] = [
  /* ─────────────────────────────── Fundamentals ─────────────────────────── */
  {
    slug: 'ts-what-and-why',
    category: 'TypeScript',
    question: 'What is TypeScript and what does it give you over JavaScript?',
    shortAnswer: 'JavaScript plus a type checker that runs before your code does. It catches wrong shapes, typos and forgotten nulls at write time, then erases itself and emits plain JavaScript.',
    shortAnswerHi: 'JavaScript ke upar ek type checker jo code chalne se pehle chalta hai. Galat shape, typo aur bhoole hue null likhte waqt pakadta hai, phir khud mit kar plain JavaScript de deta hai.',
    detailedAnswer: 'Every valid JavaScript file is valid TypeScript, so it is an addition rather than a new language. You get errors at write time instead of at runtime, autocomplete that knows your own code, refactoring that surfaces all call sites when you rename a field, and documentation that cannot go stale because the build breaks when it does. What you do not get is faster code — the emitted JavaScript is identical — or any runtime safety. The cost is build setup and some annotation effort, and it is repaid the moment a project outlives your memory of how it works.',
    detailedAnswerHi: 'Har sahi JavaScript file sahi TypeScript hai, isliye ye nayi language nahi balki ek jodi hui cheez hai. Galtiyan runtime ki jagah likhte waqt milti hain, autocomplete aapka apna code jaanta hai, field rename karne par refactoring saari call sites saamne le aati hai, aur documentation purani ho hi nahi sakti kyunki purani hote hi build toot jata hai. Jo nahi milta: tez code — nikalta hua JavaScript bilkul wahi hai — ya koi runtime safety. Keemat build setup aur thoda annotation ka mehnat hai, jo usi din wasool ho jati hai jab project aapki yaadasht se lamba chal jaye.',
    followUps: ['What happens to types at runtime?', 'Does it make code faster?', 'Can it validate API responses?'],
    difficulty: 'EASY',
    tags: ['typescript', 'basics', 'must-know'],
  },
  {
    slug: 'ts-runtime-erasure',
    category: 'TypeScript',
    question: 'What happens to your types when the code runs?',
    shortAnswer: 'They are erased. The compiler checks them, then emits plain JavaScript with every type deleted — so nothing exists at runtime to check against.',
    shortAnswerHi: 'Wo mit jate hain. Compiler unhe jaanchta hai, phir har type hata kar plain JavaScript deta hai — isliye runtime par jaanchne ko kuch bacha hi nahi.',
    detailedAnswer: 'This single fact explains most of what confuses people. You cannot test a type at runtime, because the type is gone — there is no `if (x is User)`. A cast is a promise rather than a check: `data as User` verifies nothing and crashes exactly like JavaScript would if you were wrong. Types cannot validate an API response, so `const u: User = await res.json()` type-checks happily while telling you nothing about what the server sent. It also means TypeScript cannot make code faster or safer at runtime. The one exception worth naming is enums, which do emit a real object — every other construct disappears.',
    detailedAnswerHi: 'Yahi ek baat zyadatar uljhan samjha deti hai. Runtime par type test nahi kar sakte, kyunki type hai hi nahi — `if (x is User)` hota hi nahi. Cast jaanch nahi, vaada hai: `data as User` kuch verify nahi karta aur galat hone par waise hi crash hota hai jaise JavaScript mein hota. Types API response validate nahi kar sakte, isliye `const u: User = await res.json()` khushi se pass ho jata hai aur server ne kya bheja iska kuch nahi batata. Iska matlab ye bhi hai ki TypeScript runtime par code tez ya surakshit nahi bana sakta. Ek apwaad ginane layak hai — enums, jo sach mein ek object emit karte hain; baaki har cheez gayab ho jati hai.',
    codeExample: `interface User { id: number }
const data = JSON.parse('{"id":"oops"}') as User;
data.id.toFixed(2);   // compiles fine, TypeError at runtime`,
    followUps: ['Which TypeScript feature does emit runtime code?', 'How do you actually validate input then?', 'What does a cast really do?'],
    difficulty: 'EASY',
    tags: ['typescript', 'runtime', 'must-know'],
  },
  {
    slug: 'ts-any-vs-unknown',
    category: 'TypeScript',
    question: 'Difference between any and unknown?',
    shortAnswer: 'Both accept any value. `any` disables checking for that value and everything derived from it; `unknown` lets you do nothing with it until you narrow it. Prefer unknown.',
    shortAnswerHi: 'Dono koi bhi value lete hain. `any` us value aur usse bani har cheez ki checking band kar deta hai; `unknown` narrow kiye bina kuch karne hi nahi deta. unknown behtar hai.',
    detailedAnswer: 'The dangerous part of `any` is that it spreads: one `any` at the top of a chain silently turns off checking for everything downstream, so `raw.user.profile.name` type-checks and crashes. `unknown` accepts the same values but blocks every operation until you prove what it is with `typeof`, `instanceof`, `in`, `Array.isArray` or a custom guard. That makes it the right type for anything crossing a boundary: `JSON.parse`, a `catch` variable, a third-party payload. In strict mode caught errors are already `unknown`, and correctly so, since JavaScript can throw a string. The practical rule: when you are tempted to write `any` to silence an error, write `unknown` and handle the case instead — the error was the useful part.',
    detailedAnswerHi: '`any` ka khatarnaak hissa uska phailna hai: chain ke upar ek `any` chupchaap neeche ki har cheez ki checking band kar deta hai, isliye `raw.user.profile.name` pass ho jata hai aur crash karta hai. `unknown` wahi values leta hai par har kaam rok deta hai jab tak aap `typeof`, `instanceof`, `in`, `Array.isArray` ya apne guard se sabit na karo ki wo kya hai. Isi se wo har boundary paar aati cheez ke liye sahi type ban jata hai: `JSON.parse`, `catch` ki variable, kisi aur ka payload. Strict mode mein pakde gaye errors pehle se `unknown` hote hain, aur theek hi, kyunki JavaScript string bhi throw kar sakta hai. Practical niyam: jab error chupane ko `any` likhne ka mann kare, `unknown` likho aur case sambhalo — error hi kaam ki cheez thi.',
    codeExample: `const raw: any = JSON.parse('{}');
raw.a.b.c;                      // no error, crashes

const safe: unknown = JSON.parse('{}');
// safe.a;                      // Error — must narrow first
if (typeof safe === 'object' && safe !== null) { /* usable */ }`,
    followUps: ['Why is a caught error typed unknown?', 'How do you narrow an unknown?', 'When is `any` ever acceptable?'],
    difficulty: 'EASY',
    tags: ['typescript', 'types', 'must-know'],
  },
  {
    slug: 'ts-interface-vs-type',
    category: 'TypeScript',
    question: 'interface vs type — when does it actually matter?',
    shortAnswer: 'For plain object shapes they are interchangeable. Only `type` can express unions and primitives; only `interface` can be declared twice and merged.',
    shortAnswerHi: 'Simple object shapes ke liye dono ek jaise hain. Sirf `type` unions aur primitives keh sakta hai; sirf `interface` do baar likh kar merge ho sakta hai.',
    detailedAnswer: 'Most answers to this are longer than the truth. For describing an object both work identically. `type` is the only one that can express a union (`"PENDING" | "PAID"`), a primitive alias, a tuple, or any conditional, mapped or template literal type. `interface` is the only one that supports declaration merging: declare the same name twice and the two combine, which is how you add a `user` property to Express\'s `Request` or augment any type you do not own — the single most common real reason to prefer it, and why it suits a public library API. Two subtler differences: an interface keeps its name in error messages while a type alias is often expanded into a wall of text, and an interface is not implicitly assignable to `Record<string, unknown>` because it could be merged later, which produces a genuinely baffling error the first time. A defensible rule is interface for object shapes, type for unions and anything computed — but consistency matters more than the choice.',
    detailedAnswerHi: 'Iske zyadatar jawab sach se lambe hote hain. Object batane ke liye dono bilkul ek tarah chalte hain. Sirf `type` union (`"PENDING" | "PAID"`), primitive alias, tuple, ya koi bhi conditional, mapped aur template literal type keh sakta hai. Sirf `interface` declaration merging deta hai: ek naam do baar likho aur dono mil jate hain, aur isi se Express ke `Request` par `user` jodte hain ya koi bhi paraya type badhate hain — ise chunne ki sabse aam asli wajah yahi hai, aur isiliye ye public library API ke liye theek hai. Do baareek farq: interface ka naam error messages mein bacha rehta hai jabki type alias aksar khul kar text ki deewar ban jata hai, aur interface `Record<string, unknown>` ko apne aap assign nahi hota kyunki wo baad mein merge ho sakta hai, jo pehli baar sach mein chakra dene wala error deta hai. Ek theek niyam: object shapes ke liye interface, unions aur calculate hone wali cheezon ke liye type — par chunaav se zyada consistency matter karti hai.',
    codeExample: `type Status = 'PENDING' | 'PAID';   // interface cannot do this

interface Order { id: number }
interface Order { status: Status }  // merges — both members now required`,
    followUps: ['What is declaration merging used for in practice?', 'Can an interface describe a union?', 'Why can an interface fail to satisfy Record<string, unknown>?'],
    difficulty: 'EASY',
    tags: ['typescript', 'types', 'must-know'],
  },
  {
    slug: 'ts-null-coalescing',
    category: 'TypeScript',
    question: 'Difference between ?? and ||, and why does it matter?',
    shortAnswer: '`||` falls back on any falsy value including 0, "" and false. `??` falls back only on null and undefined. Using `||` for defaults is a very common production bug.',
    shortAnswerHi: '`||` har falsy value par fallback deta hai, 0, "" aur false samet. `??` sirf null aur undefined par. Defaults ke liye `||` use karna bahut aam production bug hai.',
    detailedAnswer: 'If a user genuinely sets a quantity of 0, a discount of 0, or an empty search string, `value || fallback` silently replaces their input with the default. `value ?? fallback` only fires when nothing was provided at all, which is almost always what "default" means. The same distinction appears in optional chaining: `a?.b` stops and yields `undefined` rather than throwing, which is why it pairs naturally with `??`. One thing worth flagging in an interview: `a?.b!` is a contradiction — the `?.` says it might not exist and the `!` says it definitely does — so if you see both, one of them is wrong.',
    detailedAnswerHi: 'Agar user sach mein quantity 0, discount 0, ya khaali search string de, to `value || fallback` chupchaap uske input ki jagah default rakh deta hai. `value ?? fallback` tabhi chalta hai jab kuch diya hi na gaya ho, aur "default" ka matlab lagbhag hamesha yahi hota hai. Yahi farq optional chaining mein bhi hai: `a?.b` throw karne ki jagah ruk kar `undefined` deta hai, isliye wo `??` ke saath natural lagta hai. Interview mein batane layak ek baat: `a?.b!` ulta hai — `?.` kehta hai shayad na ho aur `!` kehta hai pakka hai — isliye dono dikhein to ek galat hai.',
    codeExample: `const qty = 0;
console.log(qty || 20);   // 20  ← wrong, user asked for 0
console.log(qty ?? 20);   // 0   ← right`,
    followUps: ['What does the `!` non-null assertion actually do?', 'What does strictNullChecks change?', 'When is optional chaining the wrong tool?'],
    difficulty: 'EASY',
    tags: ['typescript', 'null-safety', 'must-know'],
  },
  {
    slug: 'ts-strict-mode',
    category: 'TypeScript',
    question: 'What does `strict: true` enable, and why does it matter so much?',
    shortAnswer: 'A family of checks, the most important being strictNullChecks — which makes null and undefined separate types you must handle. Without it TypeScript catches very little.',
    shortAnswerHi: 'Jaanchon ka ek parivaar, jisme sabse zaroori strictNullChecks hai — jo null aur undefined ko alag types bana deta hai jinhe sambhalna padta hai. Iske bina TypeScript bahut kam pakadta hai.',
    detailedAnswer: 'It turns on `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`, `strictPropertyInitialization`, `strictBindCallApply`, `noImplicitThis` and `useUnknownInCatchVariables`. `strictNullChecks` is the one that carries most of the value: with it off, null and undefined are assignable to every type, so the single most common cause of runtime crashes goes completely unchecked — which is why people who leave it off conclude TypeScript does not catch much. The flag worth adding beyond strict is `noUncheckedIndexedAccess`, which makes `arr[0]` be `T | undefined`; it is honest about the fact that the tenth item of a three-item array does not exist, and it is the most annoying and most valuable option after strict itself. Enabling strict on an existing codebase is painful, so it belongs in the first commit.',
    detailedAnswerHi: 'Ye `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`, `strictPropertyInitialization`, `strictBindCallApply`, `noImplicitThis` aur `useUnknownInCatchVariables` chalu karta hai. Sabse zyada faayda `strictNullChecks` deta hai: band ho to null aur undefined har type ko assign ho jate hain, isliye runtime crash ki sabse aam wajah bilkul unchecked reh jati hai — aur isiliye jo log ise band rakhte hain wo maan lete hain ki TypeScript kuch pakadta nahi. Strict ke alawa jodne layak flag `noUncheckedIndexedAccess` hai, jo `arr[0]` ko `T | undefined` bana deta hai; wo is baat par imaandar hai ki teen cheezon ki list mein dasvi cheez hai hi nahi, aur strict ke baad ye sabse chidhane wala aur sabse kaam ka option hai. Purane codebase par strict chalu karna dard deta hai, isliye ise pehle commit mein hona chahiye.',
    followUps: ['What does noUncheckedIndexedAccess change?', 'Why is skipLibCheck usually recommended?', 'How would you migrate a JS codebase gradually?'],
    difficulty: 'EASY',
    tags: ['typescript', 'tsconfig', 'must-know'],
  },

  /* ─────────────────────────────── Everyday use ─────────────────────────── */
  {
    slug: 'ts-narrowing',
    category: 'TypeScript',
    question: 'What is narrowing, and what are the ways to do it?',
    shortAnswer: 'Proving which member of a union you are holding so you can use it. typeof, instanceof, `in`, Array.isArray, equality checks, and custom type predicates.',
    shortAnswerHi: 'Ye sabit karna ki union ka kaun sa member abhi haath mein hai, taaki use kar sako. typeof, instanceof, `in`, Array.isArray, barabari ki jaanch, aur apne type predicates.',
    detailedAnswer: 'Before narrowing you may only use members present on every branch of the union, so `id.toUpperCase()` on `string | number` is an error. TypeScript follows the control flow: once you check, it knows what you have for the rest of that block. The most valuable pattern is the discriminated union — give every member a shared literal field like `status`, and one check narrows the whole object. That models API results, reducer actions and state machines far better than a single object with everything optional, because it makes impossible states impossible to write down: you cannot have both `data` and `error`. Two traps worth naming: truthiness narrowing excludes `0` and `""` along with undefined, so compare against `undefined` explicitly when zero is valid; and narrowing is lost across an `await` or a callback, because the value could have changed in between.',
    detailedAnswerHi: 'Narrow karne se pehle sirf wahi members use kar sakte ho jo union ki har branch par hon, isliye `string | number` par `id.toUpperCase()` error hai. TypeScript control flow ke saath chalta hai: ek baar jaanch li to us block mein aage use pata hota hai ki kya hai. Sabse kaam ka pattern discriminated union hai — har member ko `status` jaisa ek common literal field do, aur ek jaanch poore object ko narrow kar deti hai. Ye API results, reducer actions aur state machines ko us ek object se kahin behtar dikhata hai jisme sab optional ho, kyunki isse namumkin haalat likhe hi nahi ja sakte: `data` aur `error` dono ek saath ho hi nahi sakte. Do trap ginane layak: truthiness narrowing `0` aur `""` ko bhi undefined ke saath bahar kar deta hai, isliye jahan zero sahi ho wahan seedhe `undefined` se compare karo; aur `await` ya callback ke paar narrowing chali jati hai, kyunki beech mein value badal sakti thi.',
    codeExample: `type Result =
  | { status: 'ok'; data: string }
  | { status: 'fail'; message: string };

function show(r: Result) {
  if (r.status === 'ok') return r.data;    // narrowed
  return r.message;                        // narrowed
}`,
    followUps: ['What is a discriminated union?', 'Does TypeScript verify a custom type predicate?', 'Why is narrowing lost after an await?'],
    difficulty: 'MEDIUM',
    tags: ['typescript', 'narrowing', 'must-know'],
  },
  {
    slug: 'ts-type-predicate',
    category: 'TypeScript',
    question: 'What is a type predicate, and does TypeScript check that yours is correct?',
    shortAnswer: 'A function returning `arg is Type`, which narrows in the caller when it returns true. TypeScript does not verify the body — it trusts you completely.',
    shortAnswerHi: '`arg is Type` lautane wala function, jo true dene par caller mein narrow kar deta hai. TypeScript body verify nahi karta — wo poori tarah bharosa karta hai.',
    detailedAnswer: 'Built-in checks like `typeof` and `instanceof` cannot express "is this the shape I expect", so you write a predicate: `function isUser(x: unknown): x is User`. When it returns true, the compiler treats the argument as `User` from there on. The critical point for an interview is that the compiler never checks whether the body actually establishes that — a predicate whose body is `return true` compiles and lies, which makes it a cast wearing a disguise. Assertion functions are the other half of the same idea: `function assert(x: unknown): asserts x is User` throws instead of returning a boolean and narrows everything after the call. Two rules catch people out: an assertion function needs an explicit type annotation and cannot be an arrow function assigned to an inferred variable, and `asserts x` without `is T` narrows away only null and undefined.',
    detailedAnswerHi: '`typeof` aur `instanceof` jaisi built-in jaanch "kya ye wahi shape hai" nahi keh sakti, isliye aap predicate likhte ho: `function isUser(x: unknown): x is User`. True lautane par compiler aage argument ko `User` maan leta hai. Interview ke liye zaroori baat ye hai ki compiler kabhi nahi dekhta ki body sach mein wo sabit karti hai ya nahi — jis predicate ki body `return true` ho wo bhi compile hota hai aur jhoot bolta hai, yani bhes badla hua cast. Assertion functions usi vichaar ka doosra aadha hissa hain: `function assert(x: unknown): asserts x is User` boolean ki jagah throw karta hai aur call ke baad sab narrow kar deta hai. Do niyam log bhool jate hain: assertion function ko saaf type annotation chahiye aur wo inferred variable par assign kiya arrow function nahi ho sakta, aur `is T` ke bina `asserts x` sirf null aur undefined hatata hai.',
    codeExample: `function isStringArray(x: unknown): x is string[] {
  return Array.isArray(x) && x.every((i) => typeof i === 'string');
}
// A lying predicate compiles just as happily:
// function isUser(x: unknown): x is User { return true; }`,
    followUps: ['Difference between a type predicate and an assertion function?', 'Why must an assertion function have an explicit annotation?', 'How is this different from `as`?'],
    difficulty: 'MEDIUM',
    tags: ['typescript', 'narrowing', 'guards'],
  },
  {
    slug: 'ts-generics-why',
    category: 'TypeScript',
    question: 'What problem do generics solve that `any` does not?',
    shortAnswer: 'They keep the relationship between input and output. `any[]` loses the element type; `T[]` returns exactly what you put in.',
    shortAnswerHi: 'Wo input aur output ka rishta bacha lete hain. `any[]` element ka type kho deta hai; `T[]` bilkul wahi lautata hai jo daala tha.',
    detailedAnswer: 'A function typed `(arr: any[]) => any` accepts everything and tells the caller nothing — pass numbers in, get `any` back, and all checking downstream is off. `<T>(arr: T[]) => T | undefined` accepts everything too, but the return type is tied to the argument, so passing `number[]` yields `number | undefined`. You rarely pass the type argument explicitly; it is inferred. Constraints with `extends` restrict what `T` can be so the body can use it: `<T extends { length: number }>` makes `.length` safe. The most useful pattern in application code is `<T, K extends keyof T>(obj: T, key: K): T[K]`, which types a property getter exactly and rejects keys that do not exist. The common beginner mistake is adding a type parameter that appears in only one position — a parameter exists to relate two places, so if it appears once it is doing nothing and should be a concrete type or `unknown`.',
    detailedAnswerHi: '`(arr: any[]) => any` wala function sab kuch le leta hai aur caller ko kuch nahi batata — numbers daalo, `any` milega, aur aage ki saari checking band. `<T>(arr: T[]) => T | undefined` bhi sab kuch leta hai, par return type argument se juda hai, isliye `number[]` dene par `number | undefined` milta hai. Type argument aap kam hi khud bhejte ho; wo infer hota hai. `extends` wale constraints `T` ko seemit karte hain taaki body use kar sake: `<T extends { length: number }>` se `.length` surakshit ho jata hai. Application code mein sabse kaam ka pattern `<T, K extends keyof T>(obj: T, key: K): T[K]` hai, jo property getter ko bilkul theek type karta hai aur na hone wali keys mana kar deta hai. Shuruaati galti ye hai ki aisa type parameter daal diya jaye jo sirf ek jagah aata ho — parameter do jagah jodne ke liye hota hai, to ek hi jagah ho to wo kuch nahi kar raha aur wahan concrete type ya `unknown` hona chahiye.',
    codeExample: `function get<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
const user = { id: 1, name: 'Ravi' };
get(user, 'name');   // typed string
// get(user, 'nope'); // Error`,
    followUps: ['What does `K extends keyof T` give you?', 'What is an indexed access type?', 'When is a generic parameter unnecessary?'],
    difficulty: 'MEDIUM',
    tags: ['typescript', 'generics', 'must-know'],
  },
  {
    slug: 'ts-utility-types-q',
    category: 'TypeScript',
    question: 'How would you type create and update payloads from an existing entity type?',
    shortAnswer: 'Derive them: `Omit<User, "id" | "createdAt">` for create, `Partial<CreateUser>` for update. Never hand-write the variants — copies drift.',
    shortAnswerHi: 'Unhe nikaalo: create ke liye `Omit<User, "id" | "createdAt">`, update ke liye `Partial<CreateUser>`. Variants haath se mat likho — copies alag ho jati hain.',
    detailedAnswer: 'Writing the variants by hand means every change to the entity requires updating three or four places, and you will eventually miss one — which becomes a bug months later. Deriving them means there is one source of truth and the rest follow automatically. The core set is `Partial`, `Required` and `Readonly` for modifying every property, `Pick` and `Omit` for selecting, `Record` for building key-to-value maps, `Exclude`, `Extract` and `NonNullable` for unions, and `ReturnType`, `Parameters` and `Awaited` for functions and promises. `ReturnType<typeof fn>` is how you type against a function you did not write. One trap worth mentioning: `Omit` does not validate its keys, so `Omit<User, "nmae">` compiles silently and omits nothing, while `Pick` does check because its keys are constrained to `keyof T`.',
    detailedAnswerHi: 'Variants haath se likhne ka matlab hai ki entity mein har badlav par teen-chaar jagah badalni padengi, aur ek na ek chhoot hi jayegi — jo mahinon baad bug ban kar aati hai. Nikaalne ka matlab hai sach ek jagah hai aur baaki apne aap chalte hain. Mool set: har property badalne ke liye `Partial`, `Required`, `Readonly`; chunne ke liye `Pick` aur `Omit`; key-se-value map banane ke liye `Record`; unions ke liye `Exclude`, `Extract`, `NonNullable`; aur functions aur promises ke liye `ReturnType`, `Parameters`, `Awaited`. `ReturnType<typeof fn>` se aap us function ke against type banate ho jo aapne nahi likha. Ek trap batane layak: `Omit` apni keys validate nahi karta, isliye `Omit<User, "nmae">` chupchaap compile hota hai aur kuch nahi hatata, jabki `Pick` jaanchta hai kyunki uski keys `keyof T` tak seemit hain.',
    codeExample: `type CreateUser = Omit<User, 'id' | 'createdAt'>;
type UpdateUser = Partial<CreateUser>;
type Preview   = Pick<User, 'id' | 'name'>;
type Config    = ReturnType<typeof loadConfig>;`,
    followUps: ['Which of Pick and Omit validates its keys?', 'Is Readonly deep or shallow?', 'How is Partial implemented?'],
    difficulty: 'MEDIUM',
    tags: ['typescript', 'utility-types', 'must-know'],
  },
  {
    slug: 'ts-enum-runtime',
    category: 'TypeScript',
    question: 'Do enums exist at runtime, and why might you avoid them?',
    shortAnswer: 'Yes — enums are the one TypeScript feature that emits a real object. A literal union costs nothing, and numeric enums accept any number, which is a genuine safety hole.',
    shortAnswerHi: 'Haan — enum wo akela TypeScript feature hai jo asli object emit karta hai. Literal union kuch kharch nahi karta, aur numeric enum koi bhi number le leta hai, jo sach ka safety hole hai.',
    detailedAnswer: 'Everything else in TypeScript is erased; an enum compiles to an object in your bundle. That is not automatically bad, but it is worth knowing. The real problem is numeric enums: because they support reverse mapping, `const d: Direction = 99` is accepted even when 99 is not a member, so the type safety you wanted is simply absent. If you use enums, use string enums. Most modern codebases prefer a literal union, or the `as const` array pattern when they need to iterate: `const STATUSES = ["PENDING","PAID"] as const; type Status = typeof STATUSES[number]`. That gives you one runtime array and a type derived from it, which can never drift apart. `const enum` inlines and emits nothing but breaks under `isolatedModules`, which Babel, esbuild and SWC all require, so most build setups now forbid it.',
    detailedAnswerHi: 'TypeScript ki baaki har cheez mit jati hai; enum aapke bundle mein ek object ban jata hai. Ye apne aap bura nahi, par jaanna zaroori hai. Asli dikkat numeric enums hain: reverse mapping ki wajah se `const d: Direction = 99` chal jata hai chahe 99 member ho hi na, isliye jo type safety chahiye thi wo hai hi nahi. Enum use karna hai to string enum use karo. Aajkal zyadatar codebase literal union pasand karte hain, ya iterate karna ho to `as const` array wala pattern: `const STATUSES = ["PENDING","PAID"] as const; type Status = typeof STATUSES[number]`. Isse ek runtime array aur usi se banaya type milta hai, jo kabhi alag nahi ho sakte. `const enum` inline karta hai aur kuch emit nahi karta par `isolatedModules` ke saath toot ta hai, jo Babel, esbuild aur SWC sabko chahiye, isliye ab zyadatar build setup ise mana karte hain.',
    codeExample: `enum Direction { Up, Down }
const d: Direction = 99;        // no error — the safety hole

const STATUSES = ['PENDING', 'PAID'] as const;
type Status = typeof STATUSES[number];   // 'PENDING' | 'PAID'`,
    followUps: ['What is reverse mapping?', 'How do you derive a union from an as const array?', 'Why do bundlers dislike const enum?'],
    difficulty: 'MEDIUM',
    tags: ['typescript', 'enums'],
  },
  {
    slug: 'ts-excess-property',
    category: 'TypeScript',
    question: 'Why does assigning an object literal error, but assigning the same object through a variable does not?',
    shortAnswer: 'Excess property checking. TypeScript applies an extra check to object literals assigned directly, because an unexpected key in a literal is almost always a typo.',
    shortAnswerHi: 'Excess property checking. TypeScript seedhe assign kiye object literal par ek extra jaanch lagata hai, kyunki literal mein anjaani key lagbhag hamesha typo hoti hai.',
    detailedAnswer: 'TypeScript is structurally typed: normally a value is assignable if it has at least the required members, and extra members are fine. But a literal written directly at the assignment site gets an additional check, because there is no reason to write a key that the target type does not have — it is almost certainly a misspelling. Route the same object through a variable and only structural compatibility is checked, so it passes. This is the most frequently reported "TypeScript bug" that is not a bug, and it is a good interview question because answering it correctly requires understanding structural typing. The right response to hitting it is usually to fix the typo or widen the type deliberately — using the variable indirection to sidestep the check works, but you should ask why the extra key is there first.',
    detailedAnswerHi: 'TypeScript structurally typed hai: aam taur par value assign ho jati hai agar usme kam se kam zaroori members hon, aur extra members chalte hain. Par jo literal seedhe assignment ki jagah likha ho use ek extra jaanch milti hai, kyunki aisi key likhne ki koi wajah nahi jo target type mein hai hi nahi — wo lagbhag pakka spelling ki galti hai. Wahi object variable ke zariye bhejo to sirf structural mel dekha jata hai, isliye pass ho jata hai. Ye sabse zyada report hone wala "TypeScript bug" hai jo bug hai hi nahi, aur ye achha interview sawaal hai kyunki iska sahi jawab dene ke liye structural typing samajhni padti hai. Ise milne par sahi kadam aksar typo theek karna ya jaan-boojh kar type chauda karna hai — variable se ghuma kar jaanch se bachna chalta hai, par pehle poochho ki extra key hai kyun.',
    codeExample: `interface Options { debug?: boolean }
// const a: Options = { debug: true, verbose: true };  // Error
const raw = { debug: true, verbose: true };
const b: Options = raw;                                // No error`,
    followUps: ['What is structural typing?', 'When should you sidestep the check rather than fix the key?', 'Does a class need `implements` to satisfy an interface?'],
    difficulty: 'MEDIUM',
    tags: ['typescript', 'structural-typing'],
  },
  {
    slug: 'ts-private-vs-hash',
    category: 'TypeScript',
    question: 'Difference between TypeScript `private` and JavaScript `#private`?',
    shortAnswer: '`private` is a compile-time rule that is erased — the field is fully accessible at runtime. `#field` is enforced by the JavaScript engine and is genuinely inaccessible.',
    shortAnswerHi: '`private` compile-time ka niyam hai jo mit jata hai — runtime par field poori tarah khuli hai. `#field` JavaScript engine khud lagu karta hai aur wo sach mein nahi milta.',
    detailedAnswer: 'This follows directly from erasure. `private` stops you writing `obj.secret` in TypeScript, but the emitted JavaScript has an ordinary property, so anything at runtime — a debugger, `JSON.stringify`, another library — can read it. `#secret` is a real language feature: the engine enforces it, and accessing it from outside is a syntax error rather than a type error. So if you are protecting yourself from a colleague\'s mistake, `private` is enough; if you are protecting a value from code you do not control, only `#` does that. Worth pairing with the related class facts: parameter properties (`constructor(private x: number)`) declare and assign in one line, `readonly` is likewise compile-time only, and `implements` is only a check because TypeScript is structural — a class with the right members satisfies an interface whether or not it says so.',
    detailedAnswerHi: 'Ye seedhe erasure se nikalta hai. `private` aapko TypeScript mein `obj.secret` likhne se rokta hai, par nikalte hue JavaScript mein wo aam property hoti hai, isliye runtime par kuch bhi — debugger, `JSON.stringify`, koi doosri library — use padh sakta hai. `#secret` asli language feature hai: engine ise lagu karta hai, aur bahar se use karna type error nahi balki syntax error hai. To agar aap sahyogi ki galti se bach rahe ho, `private` kaafi hai; agar aap kisi aise code se value bacha rahe ho jo aapke haath mein nahi, to sirf `#` hi kaam karega. Isse judi class ki baatein bhi jodo: parameter properties (`constructor(private x: number)`) ek line mein declare aur assign kar deti hain, `readonly` bhi sirf compile-time par hai, aur `implements` sirf ek jaanch hai kyunki TypeScript structural hai — sahi members wali class interface poora karti hai chahe likha ho ya nahi.',
    codeExample: `class Safe {
  #secret = 'hidden';    // engine-enforced
  private soft = 'open'; // compiler rule only, present at runtime
}`,
    followUps: ['What are parameter properties?', 'Is readonly enforced at runtime?', 'implements vs extends?'],
    difficulty: 'MEDIUM',
    tags: ['typescript', 'classes'],
  },
  {
    slug: 'ts-declaration-merging-q',
    category: 'TypeScript',
    question: 'How do you add a `user` property to Express\'s Request type?',
    shortAnswer: 'Declaration merging: re-declare the interface inside `declare global { namespace Express { … } }`, and remember the file needs `export {}` to be a module.',
    shortAnswerHi: 'Declaration merging: interface ko `declare global { namespace Express { … } }` ke andar dobara likho, aur yaad rakho file ko module banane ke liye `export {}` chahiye.',
    detailedAnswer: 'Interfaces with the same name in the same scope merge, which is how you extend a type you do not own without forking it. The Express case is the canonical example, and two details matter. First, the trailing `export {}` — a file with no imports or exports is a script whose declarations are already global, so `declare global` inside it is meaningless and errors; adding `export {}` makes it a module and the augmentation legal. Second, declare `user` as optional, because on unauthenticated routes it genuinely is absent. Making it required is a lie that compiles and pushes the failure to runtime; the cost of honesty is one `?.` or a narrowing check inside protected handlers. The same technique augments a module rather than the global scope by writing `declare module "express-session" { … }`.',
    detailedAnswerHi: 'Ek hi scope mein ek naam wale interfaces merge ho jate hain, aur isi se aap paraya type bina fork kiye badhate ho. Express wala case sabse aam misaal hai, aur do baatein matter karti hain. Pehli, aakhir mein `export {}` — jis file mein import ya export nahi wo script hai jiski declarations pehle se global hain, isliye usme `declare global` bemani hai aur error deta hai; `export {}` jodne se wo module ban jati hai aur augmentation jayaz ho jata hai. Doosri, `user` ko optional likho, kyunki bina login wale routes par wo sach mein nahi hota. Use zaroori banana aisa jhoot hai jo compile ho jata hai aur nakaami runtime par dhakel deta hai; imaandari ki keemat protected handlers ke andar ek `?.` ya ek jaanch hai. Yahi tareeka global ki jagah module badhane ke liye `declare module "express-session" { … }` likh kar chalta hai.',
    codeExample: `declare global {
  namespace Express {
    interface Request { user?: { id: string; role: 'ADMIN' | 'USER' } }
  }
}
export {};   // required — makes this a module`,
    followUps: ['Why does the file need `export {}`?', 'Why should `user` be optional?', 'How do you type a package that ships no types?'],
    difficulty: 'MEDIUM',
    tags: ['typescript', 'declarations', 'express'],
  },
  {
    slug: 'ts-validate-input',
    category: 'TypeScript',
    question: 'How do you actually validate an API request body, and why is typing it not enough?',
    shortAnswer: 'A runtime schema validator such as Zod, with the type derived from the schema. Typing `req.body` is a promise you made to the compiler, not a check anyone performed.',
    shortAnswerHi: 'Runtime schema validator jaise Zod, aur type usi schema se nikala hua. `req.body` par type likhna compiler se kiya gaya vaada hai, kisi ki ki hui jaanch nahi.',
    detailedAnswer: 'Types are erased before the code runs, so `const body = req.body as CreateOrder` does nothing at runtime — `req.body` is whatever the client sent, and the cast only stops the compiler asking questions. The correct pattern is validate at the boundary and trust types inside it: define a schema, parse the incoming value, and derive the TypeScript type from the schema with `z.infer` so there is a single source of truth that cannot drift. The same reasoning applies to environment variables, since `process.env.PORT` is `string | undefined` and pretending otherwise crashes on the machine where it is unset — parse once at startup and export a typed object. Two related backend points: a caught error is `unknown` under strict mode because JavaScript can throw anything, so narrow with `instanceof Error` before use; and an async Express handler returns a promise Express ignores, so an unwrapped rejection becomes an unhandled rejection instead of a 500.',
    detailedAnswerHi: 'Code chalne se pehle types mit jate hain, isliye `const body = req.body as CreateOrder` runtime par kuch nahi karta — `req.body` wahi hai jo client ne bheja, aur cast sirf compiler ka sawaal band karta hai. Sahi pattern hai boundary par validate karo aur andar types par bharosa karo: schema banao, aane wali value parse karo, aur TypeScript type usi schema se `z.infer` se nikaalo taaki sach ek hi jagah ho aur alag na ho sake. Yahi soch environment variables par bhi lagti hai, kyunki `process.env.PORT` `string | undefined` hai aur ise kuch aur maan lena us machine par crash karta hai jahan wo set nahi — shuruaat mein ek baar parse karo aur typed object export karo. Do aur backend baatein: strict mode mein pakda gaya error `unknown` hota hai kyunki JavaScript kuch bhi throw kar sakta hai, isliye use karne se pehle `instanceof Error` se narrow karo; aur async Express handler ek promise lautata hai jise Express dekhta hi nahi, isliye bina lapete rejection 500 ki jagah unhandled rejection ban jata hai.',
    codeExample: `const CreateOrder = z.object({ productId: z.string(), qty: z.number().int().positive() });
type CreateOrderBody = z.infer<typeof CreateOrder>;   // one source of truth

const parsed = CreateOrder.safeParse(req.body);
if (!parsed.success) return res.status(400).json({ error: parsed.error.issues });`,
    followUps: ['Why is a caught error typed unknown?', 'How do you type environment variables safely?', 'What breaks with an unwrapped async Express handler?'],
    difficulty: 'MEDIUM',
    tags: ['typescript', 'validation', 'backend', 'must-know'],
  },
  {
    slug: 'ts-react-usestate',
    category: 'TypeScript',
    question: 'Why does `useState([])` cause errors later, and how do you type React props well?',
    shortAnswer: '`useState([])` infers `never[]`, so every later insert fails. Annotate the element type. For props, annotate the parameter with an interface rather than using React.FC.',
    shortAnswerHi: '`useState([])` `never[]` nikaalta hai, isliye aage har insert fail hota hai. Element ka type likho. Props ke liye React.FC ki jagah parameter par interface likho.',
    detailedAnswer: 'An empty array literal gives TypeScript nothing to infer from, so it settles on `never[]` — a list that can hold nothing — and `setItems([product])` is then an error. Writing `useState<Product[]>([])` fixes it. `useState(null)` has the same issue, hence `useState<User | null>(null)`. For props, a plain interface on the parameter is the modern approach: `React.FC` used to add an implicit `children` prop even to components that accepted none, and while React 18 removed that, it still adds nothing and gets in the way of generic components. Two more worth mentioning: type children as `React.ReactNode` rather than `JSX.Element`, since the latter rejects strings, numbers and null; and extend `React.ComponentPropsWithoutRef<"input">` instead of listing native attributes by hand, which makes your component accept everything the native element does plus your own props.',
    detailedAnswerHi: 'Khaali array literal se TypeScript ko infer karne ko kuch nahi milta, isliye wo `never[]` par ruk jata hai — aisi list jisme kuch aa hi nahi sakta — aur phir `setItems([product])` error hai. `useState<Product[]>([])` likhne se theek ho jata hai. `useState(null)` mein bhi yahi dikkat hai, isliye `useState<User | null>(null)`. Props ke liye parameter par simple interface aaj ka tareeka hai: `React.FC` pehle un components mein bhi chupchaap `children` jod deta tha jinme wo tha hi nahi, aur React 18 ne wo hata diya, phir bhi wo kuch jodta nahi aur generic components ke raaste mein aata hai. Do aur baatein: children ko `JSX.Element` ki jagah `React.ReactNode` likho, kyunki doosra strings, numbers aur null mana kar deta hai; aur native attributes haath se ginane ki jagah `React.ComponentPropsWithoutRef<"input">` extend karo, jisse aapka component wo sab le leta hai jo native element leta hai, saath mein aapke apne props.',
    codeExample: `const [items, setItems] = useState<Product[]>([]);   // not useState([])
const [user, setUser] = useState<User | null>(null);

interface InputProps extends React.ComponentPropsWithoutRef<'input'> {
  label: string;
}`,
    followUps: ['Why is React.FC no longer recommended?', 'ReactNode vs JSX.Element for children?', 'How do you type a ref to a DOM element?'],
    difficulty: 'MEDIUM',
    tags: ['typescript', 'react', 'frontend'],
  },
  {
    slug: 'ts-satisfies-q',
    category: 'TypeScript',
    question: 'What problem does `satisfies` solve that a type annotation does not?',
    shortAnswer: 'It checks a value against a type without widening it, so literal types and exact keys survive. `: T` checks but widens; `satisfies T` checks and keeps the specifics.',
    shortAnswerHi: 'Wo value ko type ke against jaanchta hai bina chauda kiye, isliye literal types aur theek keys bach jati hain. `: T` jaanchta hai par chauda karta hai; `satisfies T` jaanchta hai aur khaas baat bacha leta hai.',
    detailedAnswer: 'Annotating `const routes: Record<string, string> = {...}` verifies the shape but the value now has type `Record<string, string>`, so `keyof typeof routes` is `string` rather than the actual key names, and each value is `string` rather than its literal. `satisfies` performs the same check while leaving the inferred type alone, so you get validation and precision together. It pairs naturally with the derivation idiom that keeps a constants object and its union in step: `const ROLES = {...} as const; type Role = typeof ROLES[keyof typeof ROLES]`. Read that inside out — `typeof ROLES` is the object type, `keyof` gives its keys, indexing by those keys gives the union of its values — and adding a role updates the type automatically. Note `as const` and `satisfies` are not interchangeable: `as const` also makes everything readonly and performs no checking.',
    detailedAnswerHi: '`const routes: Record<string, string> = {...}` likhne se shape jaanchi jati hai par value ka type ab `Record<string, string>` hai, isliye `keyof typeof routes` asli key naamon ki jagah `string` ho jata hai, aur har value apne literal ki jagah `string`. `satisfies` wahi jaanch karta hai aur infer kiya type waisa hi chhod deta hai, isliye validation aur theek-theek pan dono milte hain. Ye us derivation idiom ke saath natural lagta hai jo constants object aur uske union ko saath rakhta hai: `const ROLES = {...} as const; type Role = typeof ROLES[keyof typeof ROLES]`. Ise andar se bahar padho — `typeof ROLES` object ka type hai, `keyof` uski keys deta hai, un keys se index karo to values ka union milta hai — aur naya role jodte hi type khud badal jata hai. Dhyan do `as const` aur `satisfies` ek doosre ki jagah nahi chalte: `as const` sab kuch readonly bhi kar deta hai aur koi jaanch nahi karta.',
    codeExample: `const routes = { home: '/', user: '/users/:id' } satisfies Record<string, \`/\${string}\`>;
type RouteName = keyof typeof routes;   // 'home' | 'user' — not string
routes.home;                            // type '/' — the literal survives`,
    followUps: ['What does `typeof X[keyof typeof X]` produce?', 'How is `satisfies` different from `as const`?', 'Why does `: T` lose literal types?'],
    difficulty: 'HARD',
    tags: ['typescript', 'satisfies', 'advanced'],
  },

  /* ─────────────────────────────── Advanced ─────────────────────────────── */
  {
    slug: 'ts-conditional-distribution',
    category: 'TypeScript',
    question: 'What is a distributive conditional type, and how do you stop the distribution?',
    shortAnswer: 'When a naked type parameter is checked against a union, the conditional applies to each member separately and the results union back. Wrap both sides in a tuple to stop it.',
    shortAnswerHi: 'Jab naked type parameter union ke against jaancha jata hai, conditional har member par alag lagta hai aur natije wapas union ban jate hain. Rokne ke liye dono taraf tuple mein lapeto.',
    detailedAnswer: '`type ToArray<T> = T extends any ? T[] : never` applied to `string | number` gives `string[] | number[]`, not `(string | number)[]` — the union is taken apart, the conditional runs per member, and the results are unioned. This is not a quirk to work around; it is what makes `Exclude` possible. `type Exclude<T, U> = T extends U ? never : T` tests each member, turns the matching ones into `never`, and `never` disappears from a union, which leaves exactly the members you wanted. To prevent distribution, wrap: `[T] extends [U] ? … : …` compares the whole union at once. The related feature is `infer`, which declares a type variable inside the condition to capture part of a matched shape — `F extends (...a: any[]) => infer R ? R : never` is genuinely the real implementation of `ReturnType`, with no compiler magic behind it.',
    detailedAnswerHi: '`type ToArray<T> = T extends any ? T[] : never` ko `string | number` par lagao to `string[] | number[]` milta hai, `(string | number)[]` nahi — union tod diya jata hai, conditional har member par chalta hai, aur natije union ban jate hain. Ye koi ajeeb baat nahi jisse bachna ho; isi se `Exclude` mumkin hai. `type Exclude<T, U> = T extends U ? never : T` har member ko jaanchta hai, mel khane walon ko `never` bana deta hai, aur `never` union se gayab ho jata hai, jisse theek wahi members bachte hain jo chahiye the. Distribution rokne ke liye lapeto: `[T] extends [U] ? … : …` poore union ko ek saath compare karta hai. Isse judi cheez `infer` hai, jo condition ke andar type variable bana kar mile hue shape ka ek hissa pakadti hai — `F extends (...a: any[]) => infer R ? R : never` sach mein `ReturnType` ka asli implementation hai, iske peeche koi compiler jaadu nahi.',
    codeExample: `type ToArray<T> = T extends any ? T[] : never;
type A = ToArray<string | number>;        // string[] | number[]

type NoDist<T> = [T] extends [any] ? T[] : never;
type B = NoDist<string | number>;         // (string | number)[]

type MyReturnType<F> = F extends (...a: any[]) => infer R ? R : never;`,
    followUps: ['How does Exclude work internally?', 'What does `infer` do?', 'Why does never vanish from a union?'],
    difficulty: 'HARD',
    tags: ['typescript', 'advanced', 'conditional-types'],
  },
  {
    slug: 'ts-mapped-implement',
    category: 'TypeScript',
    question: 'Implement Partial, Required and Readonly yourself.',
    shortAnswer: 'Mapped types looping over keys: `{ [K in keyof T]?: T[K] }`, `{ [K in keyof T]-?: T[K] }`, `{ readonly [K in keyof T]: T[K] }`.',
    shortAnswerHi: 'Keys par ghoomne wale mapped types: `{ [K in keyof T]?: T[K] }`, `{ [K in keyof T]-?: T[K] }`, `{ readonly [K in keyof T]: T[K] }`.',
    detailedAnswer: 'A mapped type is a loop over the keys of a type, and those three are essentially the standard-library definitions. Modifiers can be added or removed: `+` adds and is implicit, `-` removes, so `-?` strips optionality — and it also removes `undefined` from the property type, not just the question mark. Key remapping with `as` lets you rename while mapping, which is how you generate getters: `[K in keyof T as \`get${Capitalize<string & K>}\`]`. Mapping a key to `never` drops it, which is the idiomatic way to filter properties by their type rather than their name — something `Pick` cannot do. One subtlety worth knowing: a mapped type written as `[K in keyof T]` is homomorphic, meaning it preserves `readonly` and `?` from the source and maps arrays and tuples element-wise instead of flattening them to objects. Writing `[K in SomeUnion]` loses that.',
    detailedAnswerHi: 'Mapped type ek type ki keys par loop hai, aur wo teeno lagbhag standard library ki hi definitions hain. Modifiers jode ya hataye ja sakte hain: `+` jodta hai aur chupchaap lagta hai, `-` hatata hai, isliye `-?` optional-pan hatata hai — aur wo property type se `undefined` bhi hata deta hai, sirf sawaaliya nishaan nahi. `as` se key remapping map karte waqt naam badalne deti hai, aur isi se getters bante hain: `[K in keyof T as \`get${Capitalize<string & K>}\`]`. Key ko `never` par map karo to wo gir jati hai, aur properties ko naam ki jagah unke type se chhaantne ka yahi tareeka hai — jo `Pick` nahi kar sakta. Ek baareeki jaanne layak: `[K in keyof T]` likha mapped type homomorphic hota hai, yani wo source ka `readonly` aur `?` bacha leta hai aur arrays aur tuples par element-dar-element chalta hai, unhe object nahi banata. `[K in SomeUnion]` likhne par ye chala jata hai.',
    codeExample: `type MyPartial<T>  = { [K in keyof T]?: T[K] };
type MyRequired<T> = { [K in keyof T]-?: T[K] };
type MyReadonly<T> = { readonly [K in keyof T]: T[K] };
type Mutable<T>    = { -readonly [K in keyof T]: T[K] };
type Getters<T>    = { [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K] };`,
    followUps: ['What makes a mapped type homomorphic?', 'How do you filter keys by their value type?', 'What does `-?` remove besides the question mark?'],
    difficulty: 'HARD',
    tags: ['typescript', 'advanced', 'mapped-types'],
  },
  {
    slug: 'ts-template-literal-q',
    category: 'TypeScript',
    question: 'What are template literal types good for, and what is the risk?',
    shortAnswer: 'Building string types from other types — typed event names, route params, CSS units. The risk is combinatorial explosion: crossing unions multiplies them.',
    shortAnswerHi: 'Doosre types se string types banana — typed event names, route params, CSS units. Khatra combination ka dher hai: unions cross karo to wo gunna ho jate hain.',
    detailedAnswer: 'They let you describe the shape a string must follow rather than listing every value, so `` `#${string}` `` accepts any hex colour and rejects "red". Crossing two unions produces every combination, which is powerful and dangerous — a few large unions produce thousands of members and will slow the compiler to a halt or exceed its complexity limit. The four intrinsics `Uppercase`, `Lowercase`, `Capitalize` and `Uncapitalize` are compiler built-ins you cannot implement yourself. The most convincing real use is extracting route parameters from a path string, which is how typed routers derive `req.params` from the route alone. The honest caveat is that this is the corner of TypeScript where cleverness is easiest and least often justified: a recursive template literal type is impressive, hard to debug, and produces error messages that help nobody, so it earns its place only where it removes a whole class of runtime bug.',
    detailedAnswerHi: 'Ye har value ginane ki jagah ye batane dete hain ki string ko kis shape par chalna hai, isliye `` `#${string}` `` koi bhi hex colour leta hai aur "red" mana kar deta hai. Do unions cross karne par har combination banta hai, jo shaktishali bhi hai aur khatarnaak bhi — kuch bade unions hazaaron member bana dete hain aur compiler ko rok denge ya uski had paar kar jayenge. Chaar intrinsics `Uppercase`, `Lowercase`, `Capitalize` aur `Uncapitalize` compiler ke andar bane hain, khud nahi likh sakte. Sabse dhang ka asli istemal path string se route parameters nikalna hai, aur isi se typed routers sirf route se `req.params` nikalte hain. Imaandar chetavni ye hai ki TypeScript ka yahi kona hai jahan chalaki sabse aasan aur sabse kam jayaz hai: recursive template literal type dekhne mein shandar, debug karne mein mushkil, aur uske error messages kisi ke kaam nahi — isliye wo tabhi jayaz hai jab poori ek kism ke runtime bug khatam kar de.',
    codeExample: `type Params<T extends string> =
  T extends \`\${string}:\${infer P}/\${infer Rest}\` ? P | Params<Rest>
  : T extends \`\${string}:\${infer P}\` ? P
  : never;

type R = Params<'/users/:userId/orders/:orderId'>;   // 'userId' | 'orderId'`,
    followUps: ['Name the four intrinsic string types.', 'What happens when you cross two large unions?', 'When is a plain `string` the better choice?'],
    difficulty: 'HARD',
    tags: ['typescript', 'advanced', 'template-literals'],
  },
  {
    slug: 'ts-exhaustive-switch',
    category: 'TypeScript',
    question: 'How do you make a switch exhaustive, so adding a union member breaks the build?',
    shortAnswer: 'Assign the switch value to `never` in the default branch. Once a new member exists, it is no longer assignable to never and you get a compile error.',
    shortAnswerHi: 'Default branch mein switch ki value ko `never` par assign karo. Naya member aate hi wo never ko assign nahi hoga aur compile error mil jayega.',
    detailedAnswer: 'After handling every case, TypeScript narrows the value in `default` to `never` — the type with no possible values. Assigning it to a `never`-typed variable therefore compiles. Add a fourth status to the union without handling it, and the default branch now sees that member instead of `never`, the assignment fails, and the build points you directly at the place that needs updating. This turns a silent fallthrough into a compile error, which is exactly the kind of bug that otherwise ships. It is usually extracted into a helper: `function assertNever(x: never): never { throw new Error("Unhandled: " + x) }`, which gives you both the compile-time guarantee and a sensible runtime error if a bad value arrives from outside your type system anyway. The same technique works for any exhaustive dispatch — reducers, state machines, discriminated union handlers.',
    detailedAnswerHi: 'Har case sambhalne ke baad TypeScript `default` mein value ko `never` par narrow kar deta hai — wo type jiski koi value ho hi nahi sakti. Isliye use `never` wali variable par assign karna compile ho jata hai. Union mein chautha status jodo aur sambhalo mat, to default branch ko ab `never` ki jagah wo member dikhta hai, assignment fail hota hai, aur build seedha us jagah le jata hai jise badalna hai. Isse chupchaap nikal jaana compile error ban jata hai, aur yahi wo bug hai jo warna ship ho jata hai. Ise aksar helper mein nikaal lete hain: `function assertNever(x: never): never { throw new Error("Unhandled: " + x) }`, jo compile-time guarantee bhi deta hai aur agar bahar se galat value aa jaye to theek runtime error bhi. Yahi tareeka har exhaustive dispatch par chalta hai — reducers, state machines, discriminated union handlers.',
    codeExample: `type Status = 'PENDING' | 'PAID';
function label(s: Status): string {
  switch (s) {
    case 'PENDING': return 'Waiting';
    case 'PAID':    return 'Done';
    default:
      const _never: never = s;   // adding 'REFUNDED' breaks the build here
      return _never;
  }
}`,
    followUps: ['What is the never type?', 'Why does never disappear from a union?', 'How would you write assertNever?'],
    difficulty: 'HARD',
    tags: ['typescript', 'never', 'exhaustiveness'],
  },
  {
    slug: 'ts-debug-errors',
    category: 'TypeScript',
    question: 'How do you approach a long "not assignable" error, and why is `as any` the wrong fix?',
    shortAnswer: 'Read the last line first — it names the actual conflict. `as any` removes the warning, not the bug, and hides every related error downstream.',
    shortAnswerHi: 'Aakhri line pehle padho — asli takraar wahi batati hai. `as any` chetavni hatata hai, bug nahi, aur aage ki har judi error bhi chhupa deta hai.',
    detailedAnswer: 'TypeScript reports the outermost mismatch first and drills down, so the final line usually names the one property that actually differs. After reading it, hover the value to see what TypeScript thinks it is — the gap between that and what you expected is the bug. Then ask one of two questions: does the compiler know something you did not (usually yes, and the fix is to narrow or check), or do you know something it does not (sometimes, and then you should be able to say why). Casting with `as any` or `as SomeType` answers neither; it silences the checker while leaving the defect, and because `any` spreads, it also switches off checking for everything derived from that value. The honest fixes, in order of preference, are narrow, validate at the boundary, or correct the type. A non-null `!` is the same trade in miniature: it converts a compile-time warning into a runtime crash.',
    detailedAnswerHi: 'TypeScript pehle sabse bahar ka mel batata hai aur andar tak jata hai, isliye aakhri line aksar wahi ek property batati hai jo sach mein alag hai. Use padhne ke baad value par hover karke dekho TypeScript kya samajh raha hai — usme aur aapki ummeed mein jo faasla hai, wahi bug hai. Phir do mein se ek sawaal poochho: kya compiler ko kuch pata hai jo aapko nahi tha (aksar haan, aur hal narrow karna ya jaanch lagana hai), ya aapko kuch pata hai jo use nahi (kabhi-kabhi, aur tab wajah bata paani chahiye). `as any` ya `as SomeType` se cast karna kisi ka jawab nahi deta; wo checker ko chup karata hai aur khaami chhod deta hai, aur `any` phailta hai isliye us value se bani har cheez ki checking bhi band ho jati hai. Imaandar hal, pasand ke kram mein: narrow karo, boundary par validate karo, ya type theek karo. Non-null `!` wahi sauda chhote roop mein hai: wo compile-time chetavni ko runtime crash bana deta hai.',
    followUps: ['What are the honest fixes for "Object is possibly undefined"?', 'Why does `any` spread?', 'What causes "Type instantiation is excessively deep"?'],
    difficulty: 'MEDIUM',
    tags: ['typescript', 'debugging', 'errors'],
  },
];
