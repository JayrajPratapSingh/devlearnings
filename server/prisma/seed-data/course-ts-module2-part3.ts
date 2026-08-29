/**
 * TypeScript Complete Course — Module 2: Objects & Interfaces, lesson 3.
 * Gap-fill lesson added after a completeness audit: classes were never
 * taught as their own topic, only touched incidentally inside a generic
 * example (Module 4). This closes that gap.
 *
 * Classes: access modifiers, parameter properties, implements, abstract
 * classes, static members. The broken example is a BankAccount class with
 * a public balance field — nothing stops external code from setting it to
 * a negative number directly, bypassing every rule the class's own methods
 * enforce. `private` is the fix: it makes bypassing impossible, not just
 * discouraged.
 *
 * `output` is used (not `preview`) — see course-ts-module1.ts's header note
 * for why.
 *
 * NOTE for future editors: escape every inline-code backtick inside these
 * template literals, INCLUDING inside plain markdown paragraphs (the
 * `content`/`contentHi`/`simple`/`simpleHi` fields) — a plain backtick used
 * for inline code inside one of those template literals terminates the
 * literal early and produces a confusing cascade of parser errors hundreds
 * of lines away. Single-quoted string fields (explain, why, q, a, task,
 * keyTakeaways, etc.) do NOT need backticks escaped — only escape apostrophes
 * there (\'). Run `npx tsc --noEmit -p .` after writing this file, before
 * wiring it into seed.ts — it is the only fully reliable check for this
 * mistake, more reliable than any regex scan.
 */

import type { CourseLesson } from './course-js-module1';

export const TS_MODULE_2_PART3: CourseLesson[] = [
  {
    slug: 'classes-access-modifiers-abstract',
    title: 'Classes: Access Modifiers, implements, and Abstract Classes',
    titleHi: 'Classes: Access Modifiers, implements, aur Abstract Classes',
    description: 'A bank balance that anyone can set to -500 directly — because nothing about the class stopped them from reaching in and changing it by hand.',
    descriptionHi: 'Ek bank balance jise koi bhi seedha -500 set kar sakta hai — kyunki class mein kuch bhi unhe haath se andar ghuskar badalne se rokta hi nahi tha.',
    difficulty: 'MEDIUM',
    duration: 30,
    order: 3,

    analogy: {
      en: '**An ATM versus a vault with the door left open.** A bank vault with its door standing open technically still holds the money, but anyone walking past can take or add whatever they want directly, bypassing every rule about minimum balances or withdrawal limits. An ATM is the same money, but the only way to touch it is through a machine that enforces the rules on every single transaction — you cannot reach in and edit the number by hand, only through the interface that was built to protect it. A class field with no access modifier is the open vault. `private` is the ATM: the data still exists, but touching it is only possible through the methods that were written to guard it.',
      hi: '**Ek ATM aur khula darwaza chhoda hua vault.** Khula darwaza wala bank vault technically paisa rakhta to hai, par jo bhi paas se guzre wo seedha jo chahe le ya jod sakta hai, minimum balance ya withdrawal limits ke har niyam ko bypass karte hue. ATM wahi paisa hai, par use chhoone ka ekmatra tarika ek machine hai jo har transaction par niyam lagu karti hai — aap haath se andar ghuskar number edit nahi kar sakte, sirf us interface se jo use bachaane ke liye bana tha. Bina access modifier wala class field wahi khula vault hai. \`private\` ATM hai: data ab bhi maujood hai, par use chhoona sirf un methods se mumkin hai jo use surksha dene ke liye likhe gaye the.',
    },

    simple: `**Start broken.** A bank account class with a public balance:

\`\`\`ts
class BankAccount {
  balance: number;

  constructor(initialBalance: number) {
    this.balance = initialBalance;
  }

  withdraw(amount: number) {
    if (amount > this.balance) {
      throw new Error("Insufficient funds");
    }
    this.balance -= amount;
  }
}

const account = new BankAccount(100);
account.withdraw(500);       // correctly throws — the rule works, when you go through it
account.balance = -500;       // ...but this ALSO compiles, and skips the rule entirely
\`\`\`

\`withdraw\` genuinely enforces "cannot go below zero" — but only if callers actually use \`withdraw\`. Because \`balance\` is a plain, public field, anything anywhere in the codebase can reach in and set it directly, bypassing every rule the class itself was written to guarantee. The class's own logic is entirely optional to respect.

**\`private\` makes bypassing impossible, not just discouraged**

\`\`\`ts
class BankAccount {
  private balance: number;

  constructor(initialBalance: number) {
    this.balance = initialBalance;
  }

  withdraw(amount: number) {
    if (amount > this.balance) {
      throw new Error("Insufficient funds");
    }
    this.balance -= amount;
  }

  getBalance(): number {
    return this.balance;
  }
}

const account = new BankAccount(100);
account.balance = -500;   // Error: Property 'balance' is private and only accessible within class 'BankAccount'.
\`\`\`

\`private\` restricts access to \`balance\` so that only code *inside \`BankAccount\` itself* can read or write it — not a subclass, not external code, nothing else. The only way in or out is through the methods the class itself provides (\`withdraw\`, \`getBalance\`), which means every rule those methods enforce is now genuinely unavoidable, not just a suggestion.

**The three access modifiers**

\`\`\`ts
class Example {
  public name: string;       // accessible from anywhere (the default — "public" is rarely written explicitly)
  private secret: string;    // accessible only inside THIS class
  protected shared: string;   // accessible inside this class AND subclasses
}
\`\`\`

\`public\` is the default if you write nothing at all. \`protected\` sits between the two: a subclass can access it, but code outside the class hierarchy entirely cannot — useful for something a base class wants to share with its subclasses without exposing it to everyone.

**Parameter properties — a shortcut you have already seen**

\`\`\`ts
class BankAccount {
  constructor(private balance: number) {}
  // this ONE line does what would otherwise take three:
  //   private balance: number;
  //   constructor(balance: number) { this.balance = balance; }
}
\`\`\`

Writing an access modifier directly on a constructor parameter is shorthand that declares the field *and* assigns it from the argument, in one line — Module 4's \`Box<T>\` example used exactly this shortcut (\`constructor(private contents: T)\`) without it being explained at the time.

**\`implements\` — a class promising to match an interface's shape**

\`\`\`ts
interface Payable {
  processPayment(amount: number): boolean;
}

class CreditCard implements Payable {
  processPayment(amount: number): boolean {
    console.log(\`Charging $\${amount} to card\`);
    return true;
  }
}
\`\`\`

\`implements\` is a promise, checked at compile time, that the class provides every member the interface requires — leave out \`processPayment\`, or give it an incompatible signature, and it is a compile error at the class declaration itself, not discovered later wherever the class happens to be used.

**Remember:** a class field with no access modifier is fully public and can be bypassed by anything, anywhere — \`private\` is what turns a class's own rules from a polite suggestion into something genuinely enforced.`,

    simpleHi: `**Toote hue se shuru.** Public balance wala ek bank account class:

\`\`\`ts
class BankAccount {
  balance: number;

  constructor(initialBalance: number) {
    this.balance = initialBalance;
  }

  withdraw(amount: number) {
    if (amount > this.balance) {
      throw new Error("Insufficient funds");
    }
    this.balance -= amount;
  }
}

const account = new BankAccount(100);
account.withdraw(500);       // sahi tarike se throw karta hai — niyam kaam karta hai, jab aap usse guzro
account.balance = -500;       // ...par ye BHI compile hota hai, aur niyam ko poori tarah chhodta hai
\`\`\`

\`withdraw\` sach mein "zero se neeche nahi jaa sakta" lagu karta hai — par sirf tab jab callers asal mein \`withdraw\` use karein. Kyunki \`balance\` ek saadha, public field hai, codebase mein kahin bhi kuch bhi andar ghuskar use seedha set kar sakta hai, class ne khud jo bhi niyam guarantee karne ke liye likhe the unhe poori tarah bypass karte hue. Class ka apna logic maanna poori tarah optional hai.

**\`private\` bypass karna namumkin banaata hai, sirf hatotsahit nahi**

\`\`\`ts
class BankAccount {
  private balance: number;

  constructor(initialBalance: number) {
    this.balance = initialBalance;
  }

  withdraw(amount: number) {
    if (amount > this.balance) {
      throw new Error("Insufficient funds");
    }
    this.balance -= amount;
  }

  getBalance(): number {
    return this.balance;
  }
}

const account = new BankAccount(100);
account.balance = -500;   // Error: Property 'balance' is private and only accessible within class 'BankAccount'.
\`\`\`

\`private\` \`balance\` tak access ko seemit karta hai taaki sirf *khud \`BankAccount\` ke andar wala* code use padh ya likh sake — koi subclass nahi, koi bahar ka code nahi, kuch aur nahi. Andar ya bahar jaane ka ekmatra tarika hai class ke apne diye methods (\`withdraw\`, \`getBalance\`), matlab wo methods jo bhi niyam lagu karte hain wo ab sach mein na-bacha sakne layak hai, sirf ek sujhaav nahi.

**Teen access modifiers**

\`\`\`ts
class Example {
  public name: string;       // kahin se bhi access hone layak (default — "public" shayad hi seedha likha jaata hai)
  private secret: string;    // sirf IS class ke andar access hone layak
  protected shared: string;   // is class ke andar AUR subclasses mein
}
\`\`\`

\`public\` default hai agar aap kuch bhi na likho. \`protected\` dono ke beech baithta hai: subclass use access kar sakta hai, par class hierarchy se bahar ka code poori tarah nahi kar sakta — kaam ka jab base class kuch apne subclasses ke saath baantna chahta hai bina use sabko dikhaye.

**Parameter properties — ek shortcut jo aap pehle dekh chuke ho**

\`\`\`ts
class BankAccount {
  constructor(private balance: number) {}
  // ye EK line wo karti hai jo warna teen leta:
  //   private balance: number;
  //   constructor(balance: number) { this.balance = balance; }
}
\`\`\`

Constructor parameter par seedha access modifier likhna ek shorthand hai jo field ko declare *bhi* karta hai *aur* use argument se assign bhi kar deta hai, ek line mein — Module 4 ke \`Box<T>\` example ne bilkul yahi shortcut (\`constructor(private contents: T)\`) use kiya tha bina us waqt use samjhaye.

**\`implements\` — ek class ka interface ki shape milaane ka wachan**

\`\`\`ts
interface Payable {
  processPayment(amount: number): boolean;
}

class CreditCard implements Payable {
  processPayment(amount: number): boolean {
    console.log(\`Charging $\${amount} to card\`);
    return true;
  }
}
\`\`\`

\`implements\` ek wachan hai, compile time par check hota hua, ki class interface ki maangi har member deti hai — \`processPayment\` chhodo, ya use asangat signature do, aur ye class declaration par hi compile error hai, baad mein kahin nahi jahan class asal mein use hoti hai.

**Yaad rakho:** bina access modifier wala class field poori tarah public hai aur kahin se bhi kuch bhi ise bypass kar sakta hai — \`private\` wo cheez hai jo class ke apne niyamon ko ek shiste wale sujhaav se badal kar sach mein lagu hone wali cheez banaati hai.`,

    content: `## The three access modifiers, precisely

\`\`\`ts
class Example {
  public a: string = "";       // accessible everywhere — the implicit default
  private b: string = "";      // accessible only inside Example itself
  protected c: string = "";     // accessible inside Example AND any subclass of it
}

class Sub extends Example {
  method() {
    console.log(this.a);   // fine
    console.log(this.b);   // Error: 'b' is private and only accessible within class 'Example'.
    console.log(this.c);   // fine — protected is visible to subclasses
  }
}

const e = new Example();
e.a;   // fine
e.c;   // Error: 'c' is protected and only accessible within class 'Example' and its subclasses.
\`\`\`

\`public\` is what you get by writing nothing — every property and method is public unless marked otherwise. \`private\` and \`protected\` are both checked entirely at compile time; there is no runtime enforcement (the compiled JavaScript has no concept of either), but for ordinary TypeScript code, the compiler reliably prevents any access that violates the declared visibility.

## Parameter properties — the constructor shorthand

\`\`\`ts
class BankAccount {
  constructor(private balance: number, public readonly accountId: string) {}
}

// equivalent, written the long way:
class BankAccountLong {
  private balance: number;
  readonly accountId: string;
  constructor(balance: number, accountId: string) {
    this.balance = balance;
    this.accountId = accountId;
  }
}
\`\`\`

Any access modifier (\`public\`, \`private\`, \`protected\`) — optionally combined with \`readonly\` (Module 2's earlier lesson) — written directly on a constructor parameter both declares that field on the class and assigns it from the argument automatically. This is purely a syntax shortcut; the two versions above compile to behaviourally identical classes.

## implements — a class fulfilling an interface's contract

\`\`\`ts
interface Shape {
  area(): number;
  perimeter(): number;
}

class Rectangle implements Shape {
  constructor(private width: number, private height: number) {}

  area(): number {
    return this.width * this.height;
  }
  perimeter(): number {
    return 2 * (this.width + this.height);
  }
}

class Broken implements Shape {
  area(): number { return 0; }
  // missing perimeter()
}
\`\`\`

\`\`\`
Error: Class 'Broken' incorrectly implements interface 'Shape'.
  Property 'perimeter' is missing in type 'Broken' but required in type 'Shape'.
\`\`\`

\`implements\` checks the class's public members against the interface's requirements, the same structural compatibility check from Module 2's earlier discussion of object shapes — a class can \`implements\` multiple interfaces at once, comma-separated, the same way an interface can \`extends\` multiple bases.

## Abstract classes — a base that cannot be instantiated directly

\`\`\`ts
abstract class Shape {
  abstract area(): number;   // no body — every subclass MUST provide one

  describe(): string {        // a real, shared implementation every subclass inherits
    return \`This shape has an area of \${this.area()}\`;
  }
}

class Circle extends Shape {
  constructor(private radius: number) { super(); }
  area(): number {
    return Math.PI * this.radius ** 2;
  }
}

new Shape();    // Error: Cannot create an instance of an abstract class.
new Circle(5);   // fine
\`\`\`

\`abstract\` on a class means it can never be instantiated with \`new\` directly — it exists only to be extended. An \`abstract\` method has no body in the base class at all; every concrete subclass is required to provide one, checked at compile time, while non-abstract methods on the same class (like \`describe\`) are real, shared implementations every subclass inherits for free. This is the natural next step from a plain \`interface\`: use an interface when you only need to describe a shape with zero shared implementation, and an abstract class when some behaviour genuinely should be shared and inherited, not just required.

## static members — belonging to the class itself, not an instance

\`\`\`ts
class Counter {
  static count = 0;

  constructor() {
    Counter.count++;
  }
}

new Counter();
new Counter();
console.log(Counter.count);   // 2 — shared across every instance, not per-instance
\`\`\`

\`static\` marks a property or method as belonging to the class itself rather than to any individual instance — accessed as \`Counter.count\`, never \`instanceOfCounter.count\`. It is the right tool for something genuinely shared across every instance, like a running count, a cache, or a factory method that creates instances.`,

    contentHi: `## Teen access modifiers, seedhe roop mein

\`\`\`ts
class Example {
  public a: string = "";       // kahin se bhi access hone layak — implicit default
  private b: string = "";      // sirf khud Example ke andar access hone layak
  protected c: string = "";     // Example ke andar AUR uske kisi bhi subclass mein
}

class Sub extends Example {
  method() {
    console.log(this.a);   // theek
    console.log(this.b);   // Error: 'b' is private and only accessible within class 'Example'.
    console.log(this.c);   // theek — protected subclasses ko dikhta hai
  }
}

const e = new Example();
e.a;   // theek
e.c;   // Error: 'c' is protected and only accessible within class 'Example' and its subclasses.
\`\`\`

\`public\` wo hai jo kuch na likhne se milta hai — har property aur method public hai jab tak alag se maarka na ho. \`private\` aur \`protected\` dono poori tarah compile time par check hote hain; koi runtime enforcement nahi (compiled JavaScript ko dono ka koi concept nahi hai), par saadhe TypeScript code ke liye, compiler reliably kisi bhi aisi access ko rokta hai jo declared visibility todti ho.

## Parameter properties — constructor shorthand

\`\`\`ts
class BankAccount {
  constructor(private balance: number, public readonly accountId: string) {}
}

// barabar, lambe tarike se likha hua:
class BankAccountLong {
  private balance: number;
  readonly accountId: string;
  constructor(balance: number, accountId: string) {
    this.balance = balance;
    this.accountId = accountId;
  }
}
\`\`\`

Koi bhi access modifier (\`public\`, \`private\`, \`protected\`) — optionally \`readonly\` (Module 2 ke pehle lesson) ke saath mila hua — seedha constructor parameter par likha hua us field ko class par declare bhi karta hai *aur* use argument se apne aap assign bhi kar deta hai. Ye poori tarah ek syntax shortcut hai; upar wale dono versions vyavhaar mein ek jaisi classes mein compile hote hain.

## implements — ek class jo interface ka contract poora karti hai

\`\`\`ts
interface Shape {
  area(): number;
  perimeter(): number;
}

class Rectangle implements Shape {
  constructor(private width: number, private height: number) {}

  area(): number {
    return this.width * this.height;
  }
  perimeter(): number {
    return 2 * (this.width + this.height);
  }
}

class Broken implements Shape {
  area(): number { return 0; }
  // perimeter() gayab hai
}
\`\`\`

\`\`\`
Error: Class 'Broken' incorrectly implements interface 'Shape'.
  Property 'perimeter' is missing in type 'Broken' but required in type 'Shape'.
\`\`\`

\`implements\` class ke public members ko interface ki maangi cheezon ke khilaaf check karta hai, Module 2 ki pehle wali object shapes charcha wala wahi structural compatibility check — class ek saath kai interfaces \`implements\` kar sakta hai, comma se alag, bilkul jaise interface kai bases \`extends\` kar sakta hai.

## Abstract classes — ek base jo seedha instantiate nahi ho sakta

\`\`\`ts
abstract class Shape {
  abstract area(): number;   // koi body nahi — har subclass ko ek dena HI HOGA

  describe(): string {        // ek asli, saanjhi implementation jo har subclass inherit karta hai
    return \`This shape has an area of \${this.area()}\`;
  }
}

class Circle extends Shape {
  constructor(private radius: number) { super(); }
  area(): number {
    return Math.PI * this.radius ** 2;
  }
}

new Shape();    // Error: Cannot create an instance of an abstract class.
new Circle(5);   // theek
\`\`\`

Class par \`abstract\` ka matlab hai use seedha \`new\` se kabhi instantiate nahi kiya ja sakta — ye sirf extend hone ke liye maujood hai. \`abstract\` method ki base class mein koi body hi nahi; har asli subclass ko ek dena zaruri hai, compile time par check hota hua, jabki usi class par non-abstract methods (jaise \`describe\`) asli, saanjhi implementations hain jo har subclass muft mein inherit karta hai. Ye saadhe \`interface\` se svaabhavik agla kadam hai: interface use karo jab aapko sirf shape batani ho bina koi saanjhi implementation ke, aur abstract class jab kuch vyavhaar sach mein saanjha aur inherit hona chahiye, sirf maangaa hua nahi.

## static members — instance ke bajaye khud class ke

\`\`\`ts
class Counter {
  static count = 0;

  constructor() {
    Counter.count++;
  }
}

new Counter();
new Counter();
console.log(Counter.count);   // 2 — har instance mein baantaa hua, per-instance nahi
\`\`\`

\`static\` property ya method ko kisi bhi akele instance ke bajaye khud class ka nishaan lagaata hai — \`Counter.count\` ki tarah access hota hai, kabhi \`instanceOfCounter.count\` nahi. Ye sahi auzaar hai kisi aisi cheez ke liye jo har instance mein sach mein saanjhi hai, jaise chalti ginti, ek cache, ya ek factory method jo instances banaata hai.`,

    examples: [
      {
        title: 'A public field can be bypassed entirely',
        titleHi: 'Public field poori tarah bypass ho sakta hai',
        code: `class BankAccount {
  balance: number;
  constructor(initialBalance: number) { this.balance = initialBalance; }
  withdraw(amount: number) {
    if (amount > this.balance) throw new Error("Insufficient funds");
    this.balance -= amount;
  }
}

const account = new BankAccount(100);
account.balance = -500;
console.log(account.balance);`,
        output: `-500
// No error, no exception. "withdraw" enforces its rule correctly, but
// direct assignment to "balance" skips that rule entirely — the class's
// own invariant was never actually guaranteed.`,
        explain: 'The bug is not in `withdraw` — it works exactly as written. The bug is that `balance` was never protected from being touched any other way.',
        explainHi: 'Bug \`withdraw\` mein nahi hai — wo bilkul likhe hue ke hisaab se kaam karta hai. Bug ye hai ki \`balance\` ko kabhi kisi aur tarike se chhue jaane se bachaaya hi nahi gaya.',
      },
      {
        title: 'private makes the same bypass a compile error',
        titleHi: 'private wahi bypass ko compile error banaata hai',
        code: `class BankAccount {
  private balance: number;
  constructor(initialBalance: number) { this.balance = initialBalance; }
  withdraw(amount: number) {
    if (amount > this.balance) throw new Error("Insufficient funds");
    this.balance -= amount;
  }
  getBalance(): number { return this.balance; }
}

const account = new BankAccount(100);
account.balance = -500;`,
        output: `Error: Property 'balance' is private and only accessible within class 'BankAccount'.

// The class's own methods still work exactly as before — only external,
// direct access to "balance" is now impossible.`,
        explain: 'Nothing about `withdraw` or the constructor changed — only the field\'s visibility did — and that alone closes the exact hole the previous example exploited.',
        explainHi: '\`withdraw\` ya constructor mein kuch nahi badla — sirf field ki visibility badli — aur akela wahi wo chhed band kar deta hai jise pichla example istemaal karta tha.',
      },
      {
        title: 'protected: visible to subclasses, not to outside code',
        titleHi: 'protected: subclasses ko dikhta hai, bahar ke code ko nahi',
        code: `class Animal {
  protected sound: string = "...";
  makeSound() { console.log(this.sound); }
}

class Dog extends Animal {
  bark() { this.sound = "Woof"; this.makeSound(); }
}

const d = new Dog();
d.bark();
d.sound = "Meow";`,
        output: `Woof

// "d.sound = \"Meow\"":
Error: Property 'sound' is protected and only accessible within class
  'Animal' and its subclasses.

// Dog, a SUBCLASS, could read and write "sound" freely inside "bark()".
// External code, even holding a Dog instance, cannot touch it directly.`,
        explain: 'protected sits precisely between public and private: it lets a class share internal state with its own subclasses while still hiding it from everything outside that inheritance chain.',
        explainHi: 'protected bilkul public aur private ke beech baithta hai: ye class ko apni internal state apne subclasses ke saath baantne deta hai jabki use us inheritance chain ke bahar se chhupaata hai.',
      },
      {
        title: 'Parameter properties: the shortcut used silently back in Module 4',
        titleHi: 'Parameter properties: Module 4 mein chupke se use hua shortcut',
        code: `class Box<T> {
  constructor(private contents: T) {}
  get(): T { return this.contents; }
}

const box = new Box(42);
console.log(box.get());`,
        output: `42
// "constructor(private contents: T)" both declared the private field
// AND assigned it from the argument — one line doing the work of what
// would otherwise be a separate field declaration plus an assignment.`,
        explain: 'This is the exact same Box<T> class from Module 4, revisited now that the shorthand it quietly relied on has been properly explained.',
        explainHi: 'Ye Module 4 ki wahi Box<T> class hai, ab dobara dekhi gayi jab shorthand jispar wo chupke se nirbhar thi use theek se samjhaya ja chuka hai.',
      },
      {
        title: 'implements checks a class against an interface at compile time',
        titleHi: 'implements class ko compile time par interface ke khilaaf check karta hai',
        code: `interface Payable {
  processPayment(amount: number): boolean;
}

class CreditCard implements Payable {
  processPayment(amount: number): boolean {
    console.log(\`Charging $\${amount}\`);
    return true;
  }
}

class GiftCard implements Payable {
  chargeAmount(amount: number): boolean { return true; }
}`,
        output: `// CreditCard: compiles fine.

// GiftCard:
Error: Class 'GiftCard' incorrectly implements interface 'Payable'.
  Property 'processPayment' is missing in type 'GiftCard' but required
  in type 'Payable'.
// The method exists, just under the WRONG name ("chargeAmount") — the
// interface's exact required name and signature must be matched.`,
        explain: 'This catches the mismatch at the class declaration itself — immediately, at the point of the mistake — rather than at some later call site expecting a `Payable` and getting something that does not actually behave like one.',
        explainHi: 'Ye mismatch ko class declaration par hi pakadta hai — bilkul galti ke pal, baad ke kisi call site par nahi jo \`Payable\` expect karta ho aur use aisa kuch mile jo asal mein waisa vyavhaar nahi karta.',
      },
      {
        title: 'An abstract class cannot be instantiated directly',
        titleHi: 'Abstract class seedha instantiate nahi ho sakta',
        code: `abstract class Shape {
  abstract area(): number;
  describe(): string {
    return \`Area: \${this.area()}\`;
  }
}

class Square extends Shape {
  constructor(private side: number) { super(); }
  area(): number { return this.side ** 2; }
}

const s = new Square(4);
console.log(s.describe());
new Shape();`,
        output: `Area: 16

// "new Shape()":
Error: Cannot create an instance of an abstract class.`,
        explain: 'Square inherited `describe()` fully implemented, for free, while being required to provide its own `area()` — abstract classes let a base share real behaviour AND enforce what every subclass must supply, at the same time.',
        explainHi: 'Square ko \`describe()\` poori tarah implemented, muft mein, wirasat mein mila, jabki use apna khud ka \`area()\` dena zaruri tha — abstract classes ek base ko asli vyavhaar baantne AUR ye lagu karne dete hain ki har subclass ko kya dena hai, dono ek saath.',
      },
      {
        title: 'A missing abstract method implementation is caught',
        titleHi: 'Gayab abstract method implementation pakdi jati hai',
        code: `abstract class Shape {
  abstract area(): number;
}

class Broken extends Shape {
  // no area() provided at all
}`,
        output: `Error: Non-abstract class 'Broken' does not implement inherited abstract
  member 'area' from class 'Shape'.

// This is caught the moment Broken is declared — before it is ever
// instantiated or used anywhere.`,
        explain: 'Just like `implements` on an interface, an abstract method is a compile-time-checked promise — a subclass that forgets to fulfil it cannot compile at all, rather than crashing later when `area()` is finally called.',
        explainHi: 'Interface par \`implements\` jaisa hi, abstract method ek compile-time-checked wachan hai — use poora karna bhoola hua subclass bilkul compile nahi ho sakta, baad mein \`area()\` bulaaye jaane par crash karne ke bajaye.',
      },
      {
        title: 'static: shared across every instance, not per-instance',
        titleHi: 'static: har instance mein saanjha, per-instance nahi',
        code: `class Counter {
  static count = 0;
  constructor() { Counter.count++; }
}

new Counter();
new Counter();
new Counter();
console.log(Counter.count);`,
        output: `3
// Three separate instances were created, but "count" is a single value
// belonging to the class itself, incremented once per construction and
// shared across all of them — not three separate per-instance counters.`,
        explain: 'Accessing `Counter.count` (on the class) rather than `instance.count` (on an object) is what signals a static member — it exists exactly once, regardless of how many instances are created.',
        explainHi: '\`instance.count\` (object par) ke bajaye \`Counter.count\` (class par) access karna wahi hai jo static member ka sanket deta hai — ye bilkul ek baar maujood hai, chahe kitne bhi instances banaye jayein.',
      },
    ],

    mistakes: [
      {
        wrong: `class BankAccount {
  balance: number;   // public by default — anything can set this directly
  constructor(b: number) { this.balance = b; }
  withdraw(amount: number) { this.balance -= amount; }
}`,
        right: `class BankAccount {
  private balance: number;   // only BankAccount's own methods can touch this
  constructor(b: number) { this.balance = b; }
  withdraw(amount: number) {
    if (amount > this.balance) throw new Error("Insufficient funds");
    this.balance -= amount;
  }
}`,
        why: 'An unmarked field is public by default, meaning any code anywhere can bypass the class\'s own methods and set it directly, defeating whatever rules those methods were written to enforce.',
        whyHi: 'Bina maarka wala field default roop se public hota hai, matlab kahin ka bhi code class ke apne methods ko bypass kar sakta hai aur use seedha set kar sakta hai, un methods ne jo bhi niyam lagu karne ke liye likhe the unhe khatam karte hue.',
      },
      {
        wrong: `class Shape {
  area(): number { throw new Error("not implemented"); }   // a runtime reminder, not a compile-time guarantee
}
class Broken extends Shape {}   // forgets to override area() — compiles fine, crashes when called`,
        right: `abstract class Shape {
  abstract area(): number;   // no body at all — subclasses MUST provide one
}
class Broken extends Shape {}   // Error: does not implement inherited abstract member 'area'.`,
        why: 'A base method that throws "not implemented" only fails when it is actually called, potentially long after the mistake was made. An abstract method makes forgetting to override it a compile error at the subclass declaration itself.',
        whyHi: '"not implemented" throw karne wali base method sirf tab fail hoti hai jab use asal mein bulaaya jaaye, shayad galti hone ke kaafi baad. Abstract method use override karna bhoolne ko subclass declaration par hi compile error bana deta hai.',
      },
      {
        wrong: `class CreditCard {
  chargeAmount(amount: number): boolean { return true; }
}
function pay(method: CreditCard) { method.processPayment(100); }
/* "method" has no declared relationship to a "Payable" concept — nothing checks this class actually fits the intended role */`,
        right: `interface Payable { processPayment(amount: number): boolean; }
class CreditCard implements Payable {
  processPayment(amount: number): boolean { return true; }
}
function pay(method: Payable) { method.processPayment(100); }`,
        why: 'Without `implements`, nothing verifies at the class declaration that CreditCard actually fulfils the intended role — a missing or misnamed method is only discovered later, wherever the class happens to be used as a Payable.',
        whyHi: '\`implements\` ke bina, class declaration par kuch bhi verify nahi karta ki CreditCard asal mein wo maqsad poora karta hai — gayab ya galat-naam wala method sirf baad mein pata chalta hai, jahan bhi class ko Payable ki tarah use kiya jaaye.',
      },
    ],

    realWorld: [
      {
        en: '**Backend frameworks built around classes — NestJS, Angular\'s services, TypeORM entities — rely heavily on access modifiers, `implements`, and abstract base classes**, making this lesson\'s patterns close to mandatory knowledge for that style of codebase, distinct from the function-heavy style common in plain React.',
        hi: '**Classes ke aas-paas bani backend frameworks — NestJS, Angular ki services, TypeORM entities — access modifiers, \`implements\`, aur abstract base classes par bhaari nirbhar hain**, is lesson ke patterns ko us tarah ki codebase ke liye lagbhag zaruri jaankari banate hue, saadhe React mein aam function-heavy style se alag.',
      },
      {
        en: '**Abstract classes are the standard pattern for a plugin system or a shared base with required per-implementation behaviour** — a `PaymentProcessor` abstract class with a shared `logTransaction()` method and an abstract `charge()` each processor must implement is a textbook real-world use.',
        hi: '**Abstract classes plugin system ya required per-implementation vyavhaar wale saanjhe base ke liye standard pattern hain** — ek \`PaymentProcessor\` abstract class jisme saanjha \`logTransaction()\` method aur ek abstract \`charge()\` ho jise har processor implement kare, ye ek textbook asli-duniya istemaal hai.',
      },
      {
        en: '**`private` fields backing a public getter/setter is the standard encapsulation pattern in real-world OOP TypeScript**, letting a class validate or transform a value on every read or write instead of exposing raw mutable state — exactly what this lesson\'s `BankAccount` example demonstrated.',
        hi: '**Public getter/setter ke peeche \`private\` fields asli-duniya OOP TypeScript mein standard encapsulation pattern hai**, jo class ko har padhne ya likhne par ek value validate ya transform karne deta hai, kachchi badalne layak state expose karne ke bajaye — bilkul wahi jo is lesson ka \`BankAccount\` example dikhaata hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between `public`, `private`, and `protected`, and what happens if no modifier is written at all?',
        qHi: '\`public\`, \`private\`, aur \`protected\` mein kya fark hai, aur agar koi bhi modifier na likha jaaye to kya hota hai?',
        a: '`public` members are accessible from anywhere — inside the class, from subclasses, and from external code holding a reference to an instance. `private` members are accessible only from within the exact class they are declared in, not even from subclasses. `protected` members sit in between: accessible within the declaring class and any of its subclasses, but not from external code outside that inheritance chain. If no modifier is written at all, a member is public by default — this is why a bank balance field with no explicit modifier can be set directly from anywhere, bypassing whatever rules the class\'s own methods try to enforce.',
        aHi: '\`public\` members kahin se bhi access hone layak hain — class ke andar, subclasses se, aur instance ka reference rakhne wale bahar ke code se. \`private\` members sirf usi khaas class ke andar se access hone layak hain jisme wo declare hue hain, subclasses se bhi nahi. \`protected\` members beech mein baithte hain: declare karne wali class aur uske kisi bhi subclass ke andar access hone layak, par us inheritance chain se bahar ke code se nahi. Agar bilkul koi modifier na likha jaaye, member default roop se public hota hai — isi wajah se bina seedhe modifier wala bank balance field kahin se bhi seedha set kiya ja sakta hai, class ke apne methods jo bhi niyam lagu karne ki koshish karte hain unhe bypass karte hue.',
      },
      {
        q: 'What are parameter properties, and what do they actually expand into?',
        qHi: 'Parameter properties kya hain, aur wo asal mein kya bankar khulti hain?',
        a: 'A parameter property is an access modifier (optionally combined with `readonly`) written directly on a constructor parameter, like `constructor(private balance: number)`. It is pure shorthand: it both declares a field of that name and visibility on the class, and assigns it from the constructor argument, in a single line. Written the long way, it expands to a separate field declaration (`private balance: number;`) above the constructor, plus an explicit assignment (`this.balance = balance;`) inside the constructor body — the two forms are behaviourally identical, with the parameter-property version simply avoiding the repetition.',
        aHi: 'Parameter property ek access modifier hai (optionally \`readonly\` ke saath mila hua) jo seedha constructor parameter par likha jaata hai, jaise \`constructor(private balance: number)\`. Ye khaalis shorthand hai: ye class par us naam aur visibility wali field declare bhi karta hai, aur use constructor argument se assign bhi kar deta hai, ek hi line mein. Lambe tarike se likha jaaye, ye constructor ke upar ek alag field declaration (\`private balance: number;\`) mein khulta hai, plus constructor body ke andar ek seedha assignment (\`this.balance = balance;\`) — dono roop vyavhaar mein ek jaise hain, parameter-property wala version bas dohraav se bachaata hai.',
      },
      {
        q: 'What does `implements` check, and how is it different from `extends`?',
        qHi: '\`implements\` kya check karta hai, aur ye \`extends\` se kaise alag hai?',
        a: '`implements` is used on a class to declare that it will provide every member an interface requires — the compiler checks this at the class declaration itself, verifying the class has each required method or property with a compatible signature, and reports an error there if anything is missing or mismatched. This is different from `extends`, which is used for actual inheritance: a class `extends` another class to inherit its real implementation (fields, method bodies, constructor logic), while `implements` only checks against an interface\'s shape, which has no implementation to inherit in the first place. A class can `implements` multiple interfaces at once but can only `extends` one base class.',
        aHi: '\`implements\` class par use hota hai ye declare karne ke liye ki wo interface ki maangi har member degi — compiler ise class declaration par hi check karta hai, verify karte hue ki class ke paas har zaruri method ya property compatible signature ke saath hai, aur agar kuch gayab ya mismatch ho to wahin error report karta hai. Ye \`extends\` se alag hai, jo asli inheritance ke liye use hota hai: class \`extends\` doosri class ki asli implementation (fields, method bodies, constructor logic) inherit karne ke liye use karti hai, jabki \`implements\` sirf interface ki shape ke khilaaf check karta hai, jiske paas shuru mein hi koi implementation nahi hoti inherit karne ke liye. Class ek saath kai interfaces \`implements\` kar sakta hai par sirf ek base class \`extends\` kar sakta hai.',
      },
      {
        q: 'What is an abstract class, and when would you choose it over a plain interface?',
        qHi: 'Abstract class kya hai, aur ise saadhe interface ke mukable kab chunoge?',
        a: 'An abstract class is a class that cannot be instantiated directly with `new` — it exists only to be extended by subclasses. It can declare `abstract` methods, which have no body and must be implemented by every concrete subclass (checked at compile time, similar to `implements`), and it can also declare ordinary, fully-implemented methods that every subclass inherits and shares automatically. The choice between an abstract class and a plain interface comes down to whether there is real, shared behaviour to provide: an interface only describes a shape with zero implementation, while an abstract class is appropriate when some methods should be required per-subclass (abstract methods) while others should be written once and inherited by all subclasses (concrete methods).',
        aHi: 'Abstract class ek aisi class hai jise seedha \`new\` se instantiate nahi kiya ja sakta — ye sirf subclasses dwara extend hone ke liye maujood hai. Ye \`abstract\` methods declare kar sakti hai, jinki koi body nahi hoti aur har asli subclass ko unhe implement karna zaruri hai (compile time par check hota hai, \`implements\` jaisa hi), aur ye saadhe, poori tarah implemented methods bhi declare kar sakti hai jo har subclass apne aap inherit aur baantta hai. Abstract class aur saadhe interface ke beech chunaav isi baat par tay hota hai ki koi asli, saanjha vyavhaar dena hai ya nahi: interface sirf ek shape batata hai bina kisi implementation ke, jabki abstract class tab sahi hai jab kuch methods har-subclass ke hisaab se zaruri hon (abstract methods) jabki baaki ek baar likhe jaaye aur har subclass inherit kare (concrete methods).',
      },
      {
        q: 'What does the `static` keyword mean on a class member, and how is it different from an instance property?',
        qHi: 'Class member par \`static\` keyword ka kya matlab hai, aur ye instance property se kaise alag hai?',
        a: '`static` marks a property or method as belonging to the class itself, rather than to any individual instance created from it — it is accessed directly on the class name (`Counter.count`), never through an instance (`myCounter.count` would not find it). This means a static property exists exactly once, shared across every instance, rather than each instance holding its own separate copy the way a regular (non-static) property does — incrementing a static counter in the constructor, for example, tracks the total number of instances ever created, because every instance is incrementing the same single shared value.',
        aHi: '\`static\` property ya method ko usse banaaye gaye kisi bhi akele instance ke bajaye khud class ka nishaan lagaata hai — ye seedha class naam par access hota hai (\`Counter.count\`), kabhi instance ke zariye nahi (\`myCounter.count\` use dhoondh nahi payega). Iska matlab hai static property bilkul ek baar maujood hai, har instance mein saanjhi, har instance apni alag copy rakhne ke bajaye jaisa ek aam (non-static) property karti hai — misaal ke taur par constructor mein static counter badhaana, ab tak banaaye gaye instances ki kul ginti track karta hai, kyunki har instance usi ek saanjhi value ko badhaata hai.',
      },
    ],

    exercises: [
      {
        task: 'Write a `BankAccount` class with a public `balance` field. Set it directly to a negative number from outside the class and confirm it compiles. Mark `balance` private and confirm the same line now fails.',
        taskHi: 'Public \`balance\` field wala \`BankAccount\` class likho. Use class ke bahar se seedha ek negative number set karo aur confirm karo wo compile hota hai. \`balance\` ko private maarko aur confirm karo wahi line ab fail hoti hai.',
        hint: 'Add a `getBalance()` method so external code can still read the value after making `balance` private.',
        hintHi: '\`getBalance()\` method jodo taaki \`balance\` ko private banaane ke baad bhi bahar ka code value padh sake.',
      },
      {
        task: 'Write an `abstract class Shape` with an abstract `area()` method and a concrete `describe()` method that calls it. Create two subclasses (e.g. `Circle`, `Square`) and confirm `new Shape()` itself fails to compile.',
        taskHi: 'Abstract \`area()\` method aur ise bulaane wale concrete \`describe()\` method wala \`abstract class Shape\` likho. Do subclasses banao (jaise \`Circle\`, \`Square\`) aur confirm karo \`new Shape()\` khud compile hone mein fail hota hai.',
        hint: 'Try deliberately forgetting to implement `area()` in one subclass to see the exact compile error it produces.',
        hintHi: 'Ek subclass mein jaan-boojh kar \`area()\` implement karna bhoolne ki koshish karo dekhne ke liye ye bilkul kaunsi compile error deta hai.',
      },
      {
        task: 'Write an interface `Payable` with one method, then write two classes: one that correctly `implements` it, and one that provides a similarly-named but incorrect method. Compare the two compile results.',
        taskHi: 'Ek method wala interface \`Payable\` likho, phir do classes likho: ek jo use sahi tarike se \`implements\` kare, aur ek jo milte-julte naam wala par galat method de. Dono compile nateeje compare karo.',
        hint: 'Try both a missing method entirely and a method with the right name but a wrong parameter type, to see two different kinds of implements errors.',
        hintHi: 'Do alag kism ki implements errors dekhne ke liye poori tarah gayab method aur sahi naam par galat parameter type wala method, dono try karo.',
      },
    ],

    keyTakeaways: [
      'A class field with no access modifier is public by default and can be bypassed by anything, anywhere — `private` restricts access to code inside the class itself, making the class\'s own rules genuinely unavoidable.',
      '`protected` sits between `public` and `private`: accessible within the class and its subclasses, but not from external code.',
      'A parameter property (an access modifier written directly on a constructor parameter) declares a field and assigns it from the argument in one line.',
      '`implements` checks a class against an interface\'s required shape at compile time, at the class declaration itself, rather than the mismatch surfacing later wherever the class is used.',
      'An `abstract` class cannot be instantiated directly; its abstract methods must be implemented by every subclass, while its concrete methods are shared and inherited automatically.',
      '`static` marks a member as belonging to the class itself, shared across every instance, rather than each instance holding its own separate copy.',
    ],
    keyTakeawaysHi: [
      'Bina access modifier wala class field default roop se public hai aur kahin se bhi kuch bhi ise bypass kar sakta hai — \`private\` access ko khud class ke andar wale code tak seemit karta hai, class ke apne niyamon ko sach mein na-bacha sakne layak banate hue.',
      '\`protected\` \`public\` aur \`private\` ke beech baithta hai: class aur uske subclasses ke andar access hone layak, bahar ke code se nahi.',
      'Parameter property (seedha constructor parameter par likha access modifier) ek field declare karta hai aur use argument se ek line mein assign kar deta hai.',
      '\`implements\` class ko compile time par, class declaration par hi, interface ki maangi shape ke khilaaf check karta hai, mismatch ke baad mein jahan bhi class use ho wahan saamne aane ke bajaye.',
      '\`abstract\` class seedha instantiate nahi ho sakta; uske abstract methods har subclass dwara implement kiye jaane chahiye, jabki uske concrete methods apne aap saanjhe aur wirasat mein milte hain.',
      '\`static\` member ko khud class ka nishaan lagaata hai, har instance mein saanjha, har instance apni alag copy rakhne ke bajaye.',
    ],
  },
];
