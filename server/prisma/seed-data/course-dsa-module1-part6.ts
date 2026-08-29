/**
 * DSA Complete Course — Module 1: Foundations, lesson 6 (final lesson of
 * Module 1).
 *
 * Strings: why they are immutable in JavaScript/TypeScript (and most
 * mainstream languages), and why repeatedly concatenating strings inside
 * a loop is a hidden O(n^2) trap directly analogous to this module's
 * earlier "hidden nested scan inside a loop" lesson. Broken example:
 * building up a large string via += inside a loop, which looks like a
 * single O(n) loop but silently costs O(n^2), because each += creates an
 * entirely new string (strings cannot be modified in place) and copies
 * everything built so far into it. Fixed by collecting pieces in an
 * array and joining once at the end, which defers the expensive
 * concatenation to a single O(n) operation instead of paying an O(n)
 * copy cost on every single iteration.
 *
 * NOTE for future editors: escape every inline-code backtick inside these
 * template literals, INCLUDING inside plain markdown paragraphs (the
 * `content`/`contentHi`/`simple`/`simpleHi` fields). Single-quoted string
 * fields (explain, why, q, a, task, keyTakeaways, etc.) do NOT need backticks
 * escaped — only escape apostrophes there as a SINGLE backslash (\'), never
 * doubled (\\'), which breaks the string. Run `npx tsc --noEmit -p .` after
 * writing this file, before wiring it into seed.ts — it is the only fully
 * reliable check for both mistakes. Also scan with a Python regex for stray
 * Devanagari characters before seeding.
 */

import type { CourseLesson } from './course-js-module1';

export const DSA_MODULE_1_PART6: CourseLesson[] = [
  {
    slug: 'strings-immutability-and-operations',
    title: 'Strings: Immutability and the Hidden Cost of Concatenation',
    titleHi: 'Strings: Immutability Aur Concatenation Ki Chhupi Hui Keemat',
    description: 'A function building a report by appending one line at a time with += looks like a simple, single O(n) loop. On a report with 200 lines it finishes instantly; on one with 200,000 lines, the exact same loop takes over a minute — the same hidden-cost trap this module already taught, wearing a string\'s clothes.',
    descriptionHi: 'Ek function jo ek report banaata hai ek waqt mein ek line \`+=\` se jodkar ek saadha, akela \`O(n)\` loop jaisa dikhta hai. 200 lines waali ek report par ye turant khatam hota hai; 200,000 lines waali par, bilkul wahi loop ek minute se zyaada leta hai — wahi chhupi-hui-keemat wala trap jo ye module pehle hi sikha chuka hai, ek string ke kapdon mein.',
    difficulty: 'EASY',
    duration: 18,
    order: 6,

    analogy: {
      en: '**A scribe who, every single time a new sentence needs to be added to a growing manuscript, copies out the ENTIRE manuscript so far onto a brand-new scroll before adding the new sentence at the end, versus a scribe who writes each new sentence on its own separate small card, tossing every card into a single growing pile, and only assembles everything onto one final scroll at the very end.** The first scribe\'s manuscript is only one sentence long on day one, so recopying "everything so far" costs almost nothing; but by day two hundred, "everything so far" is two hundred sentences long, and the scribe must recopy all two hundred of them just to add sentence two hundred and one, then recopy two hundred and one sentences to add the next, and so on — the recopying cost grows right alongside the manuscript itself, making each additional sentence progressively, needlessly more expensive to add than the last. The second scribe\'s cost per new sentence never changes at all — writing one new small card and tossing it onto the pile costs the same whether it is the first card or the ten-thousandth, and the only expensive step, assembling everything into one final scroll, happens exactly once, at the very end, rather than being repeated and re-paid before every single new sentence. A string, in JavaScript and most mainstream languages, cannot actually be modified after it is created — appending to a string via \`+=\` does not add characters onto the end of the existing string in place; it creates an entirely new string containing a copy of everything that came before, plus the new piece, exactly like the first scribe\'s expensive full recopy. Collecting pieces in an array and joining them once at the very end is the second scribe\'s pile of small cards: each piece is added cheaply, and the one expensive assembly step happens only once.',
      hi: '**Ek scribe jo, har akeli baar jab ek badhte manuscript mein ek naya vaakya jodna hota hai, ab tak ka POORA manuscript ek bilkul-naye scroll par copy karta hai isse pehle ki naya vaakya ant mein jode, versus ek scribe jo har naya vaakya apne alag chhote card par likhta hai, har card ko ek akele badhte dher mein daalte hue, aur sirf bilkul ant mein har cheez ko ek aakhri scroll par jodta hai.** Pehle scribe ka manuscript pehle din sirf ek vaakya lamba hai, isliye "ab tak sab kuch" recopy karna lagbhag kuch nahi kharch karta; par din do sau tak, "ab tak sab kuch" do sau vaakya lamba hai, aur scribe ko un sab do sau ko recopy karna padta hai sirf vaakya do sau ek jodne ke liye, phir do sau ek vaakya recopy karna agla jodne ke liye, aur aise hi — recopy karne ki keemat manuscript ke saath saath badhti hai, har atirikt vaakya ko pichle se pragati se, bina-zaroorat zyaada mehenga banaate hue. Doosre scribe ki prati-naya-vaakya keemat kabhi bilkul nahi badalti — ek naya chhota card likhna aur ise dher mein daalna samaan keemat leta hai chahe ye pehla card ho ya das-hazaaraan — aur akela mehenga step, sab kuch ek aakhri scroll mein jodna, bilkul ek baar hota hai, bilkul ant mein, har akele naye vaakya se pehle dohraaya aur dobara chukaaya jaane ke bajaye. Ek string, JavaScript aur adhikaansh mainstream bhaashaon mein, banaaye jaane ke baad asal mein modify nahi ki jaa sakti — \`+=\` ke zariye ek string mein jodna maujood string ke ant mein characters in place mein nahi jodta; ye ek bilkul-nayi string banaata hai jismein pehle jo bhi aaya uski copy hai, plus naya tukda, bilkul pehle scribe ke mehenge poore recopy ki tarah. Chhote pieces ko ek array mein collect karna aur unhe bilkul ant mein ek baar jodna doosre scribe ke chhote cards ke dher jaisa hai: har piece sasta jodا jaata hai, aur ek mehenga assembly step sirf ek baar hota hai.',
    },

    simple: `**Start broken.** Building a large string with += inside a loop:

\`\`\`js
function buildReport(lines) {
  let report = "";
  for (let i = 0; i < lines.length; i++) {
    report += lines[i] + "\\n"; // looks like one cheap append per iteration
  }
  return report;
}
\`\`\`

This looks, visually, exactly like a single \`O(n)\` loop — one iteration per line, doing what appears to be one small, cheap operation each time. The hidden cost is that a string, once created, cannot actually be changed — \`report += lines[i]\` does not extend the EXISTING \`report\` string in place; it creates a BRAND-NEW string containing a full copy of everything \`report\` held before, plus the new piece, and reassigns that new string back to the \`report\` variable. On the very first iteration, this copy is nearly free, since \`report\` is still short. By the ten-thousandth iteration, \`report\` may already hold thousands of characters, and each additional \`+=\` must copy ALL of those existing characters over into a new string before adding the next small piece — the copying cost grows right alongside \`report\`\'s own length, turning what looks like an \`O(n)\` loop into a genuine \`O(n²)\` operation overall, the exact same hidden-nested-cost trap this module\'s earlier lesson on analyzing loops already covered, wearing a string\'s clothes instead of an array\'s.

**The fix: collect pieces in an array, join once at the end**

\`\`\`js
function buildReport(lines) {
  const pieces = [];
  for (let i = 0; i < lines.length; i++) {
    pieces.push(lines[i]); // pushing onto an array is O(1), not a full copy
  }
  return pieces.join("\\n"); // ONE join operation, at the very end
}
\`\`\`

\`\`\`ts
function buildReport(lines: string[]): string {
  const pieces: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    pieces.push(lines[i]);
  }
  return pieces.join("\\n");
}
\`\`\`

Pushing an item onto the end of an array (this course\'s later stack-and-queue module covers exactly why) costs \`O(1)\`, not a full copy of everything already in the array — so collecting all \`n\` pieces costs a genuine, honest \`O(n)\` total. The one expensive step, actually assembling every piece into a single final string via \`.join()\`, happens exactly ONCE, after the loop, costing \`O(n)\` on its own — giving a true total cost of \`O(n) + O(n) = O(n)\`, not the \`O(n²)\` the broken version silently paid.`,

    simpleHi: `**Toote hue se shuru.** Ek loop ke andar \`+=\` se ek bada string banaana:

\`\`\`js
function buildReport(lines) {
  let report = "";
  for (let i = 0; i < lines.length; i++) {
    report += lines[i] + "\\n"; // prati-iteration ek sasta append jaisa dikhta hai
  }
  return report;
}
\`\`\`

Ye visually bilkul ek akele \`O(n)\` loop jaisa dikhta hai — prati line ek iteration, har baar jo ek chhota, sasta operation lagta hai kar rahe hue. Chhupi hui keemat ye hai ki ek string, ek baar banaayi jaane par, asal mein badli nahi jaa sakti — \`report += lines[i]\` MAUJOOD \`report\` string ko in place mein extend nahi karta; ye ek BILKUL-NAYI string banaata hai jismein \`report\` pehle jo bhi rakhta tha uski poori copy hai, plus naya tukda, aur us nayi string ko wapas \`report\` variable mein reassign karta hai. Bilkul pehli iteration par, ye copy lagbhag muft hai, kyunki \`report\` abhi bhi chhota hai. Das-hazaaraan iteration tak, \`report\` shaayad pehle se hazaaron characters rakhta ho, aur har atirikt \`+=\` ko un maujood characters SAB ko ek nayi string mein copy karna hai agla chhota tukda jodne se pehle — copy karne ki keemat \`report\` ki apni lambaayi ke saath saath badhti hai, jo \`O(n)\` loop jaisa dikhta hai use ek asli \`O(n²)\` operation mein badalte hue overall, bilkul wahi chhupi-hui-nested-keemat wala trap jise is module ke pehle wale loops ka vishleshan karne wale lesson ne pehle hi cover kiya, ek array ke kapdon ke bajaye ek string ke kapdon mein.

**Fix: pieces ko ek array mein collect karo, ant mein ek baar jodo**

\`\`\`js
function buildReport(lines) {
  const pieces = [];
  for (let i = 0; i < lines.length; i++) {
    pieces.push(lines[i]); // ek array mein push karna O(1) hai, poori copy nahi
  }
  return pieces.join("\\n"); // AKELA join operation, bilkul ant mein
}
\`\`\`

\`\`\`ts
function buildReport(lines: string[]): string {
  const pieces: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    pieces.push(lines[i]);
  }
  return pieces.join("\\n");
}
\`\`\`

Ek array ke ant mein ek item push karna (is course ka baad ka stack-aur-queue module bilkul batata hai kyun) \`O(1)\` leta hai, array mein pehle se maujood har cheez ki poori copy nahi — isliye sab \`n\` pieces collect karna ek asli, honest \`O(n)\` total leta hai. Ek mehenga step, har piece ko \`.join()\` ke zariye ek akeli aakhri string mein asal mein assemble karna, bilkul EK BAAR hota hai, loop ke baad, khud \`O(n)\` leta hue — ek asli total keemat \`O(n) + O(n) = O(n)\` dete hue, wo \`O(n²)\` nahi jo toota version chupchaap chukaata tha.`,

    content: `## Why strings are immutable in the first place

\`\`\`js
let s = "hello";
s[0] = "H"; // this does NOTHING — strings cannot be modified by index
console.log(s); // still "hello"

s = "H" + s.slice(1); // this WORKS — it creates a new string entirely
console.log(s); // "Hello"
\`\`\`

In JavaScript, TypeScript, Python, Java, and most mainstream languages, a string\'s own characters cannot be changed after the string is created — every operation that appears to "modify" a string (\`+=\`, \`.replace()\`, \`.toUpperCase()\`, slicing and reassigning) actually creates a brand-new string and leaves the original untouched. Attempting to assign directly to a character position, like \`s[0] = "H"\`, silently does nothing at all in JavaScript, precisely because strings do not support in-place modification the way arrays do. Immutability is a deliberate design choice with real, positive benefits — an immutable string can be safely shared between different parts of a program without any risk that one part accidentally changes it out from under another — but it comes with the direct, mechanical consequence this lesson\'s broken example ran into: any operation that repeatedly appends to a string is repeatedly paying the cost of creating an entirely new copy, not a cheap in-place extension.

## Recognizing the same hidden-cost shape across arrays and strings

\`\`\`
Module 1's earlier lesson: a loop containing .includes() hides an O(n)
scan inside what looks like an O(n) loop → real cost O(n²)

This lesson: a loop containing += on a string hides an O(n) copy
inside what looks like an O(n) loop → real cost O(n²)
\`\`\`

This lesson\'s trap is not a new idea — it is the exact same "check what each iteration\'s own body actually costs" principle this module\'s earlier lesson on analyzing loops already established, applied to a different, string-specific operation. \`Array.prototype.includes()\` inside a loop hides an \`O(n)\` scan; \`+=\` on a string inside a loop hides an \`O(n)\` copy — both look, from a distance, like "one cheap operation per iteration", and both are actually an \`O(n)\` operation happening \`n\` times, for a true total of \`O(n²)\`. Recognizing this recurring shape — an apparently O(1) operation that is secretly O(n) because of how the underlying data structure actually works — is one of the single most transferable skills this course\'s first module builds, since it applies to essentially every data structure covered in every module that follows.

## When to reach for an array-and-join instead of direct concatenation

A small, fixed number of string concatenations (joining two or three specific pieces together once) genuinely costs very little regardless of technique, since the "recopy everything" cost only becomes significant once it is paid repeatedly, inside a loop, as this lesson\'s broken example did. The array-and-join pattern specifically earns its keep once string-building happens inside a loop whose iteration count could genuinely grow large — building a report line by line, assembling a large block of text from many smaller pieces, or accumulating output across many iterations of a larger algorithm. The underlying judgment call is the same one this course\'s very first lesson introduced: a technique\'s cost only matters once the data it operates on grows large enough for that cost to be felt, and the professional habit is checking for this before it becomes a real problem, not after.`,

    contentHi: `## Strings shuru mein immutable kyun hain

\`\`\`js
let s = "hello";
s[0] = "H"; // ye KUCH NAHI karta — strings ko index se modify nahi kiya jaa sakta
console.log(s); // abhi bhi "hello"

s = "H" + s.slice(1); // ye KAAM KARTA HAI — ye poori tarah ek nayi string banaata hai
console.log(s); // "Hello"
\`\`\`

JavaScript, TypeScript, Python, Java, aur adhikaansh mainstream bhaashaon mein, ek string ke apne characters banaaye jaane ke baad badle nahi jaa sakte — har operation jo ek string ko "modify" karta hua dikhta hai (\`+=\`, \`.replace()\`, \`.toUpperCase()\`, slicing aur reassign karna) asal mein ek bilkul-nayi string banaata hai aur asli ko bina-chhue chhodta hai. Seedhe ek character position ko assign karne ki koshish karna, jaisa \`s[0] = "H"\`, JavaScript mein chupchaap bilkul kuch nahi karta, bilkul isliye kyunki strings in-place modification support nahi karti jaisa arrays karte hain. Immutability ek jaan-boojhkar liya gaya design faisla hai asli, sakaaraatmak faaydon ke saath — ek immutable string ko ek program ke alag hisso ke beech surakshit roop se share kiya jaa sakta hai bina kisi khatre ke ki ek hissa galti se ise doosre ke neeche se badal de — par ye seedha, mechanical parinaam laata hai jispar is lesson ka toota example aaya: koi bhi operation jo baar-baar ek string mein jodta hai baar-baar ek bilkul nayi copy banaane ki keemat chukaa raha hai, ek sasti in-place extension nahi.

## Arrays aur strings ke aar-paar wahi chhupi-hui-keemat shape pehchaanna

\`\`\`
Module 1 ka pehle wala lesson: ek loop jismein \`.includes()\` hai ek
\`O(n)\` scan chhupaata hai us cheez ke andar jo ek \`O(n)\` loop jaisa
dikhta hai → asli keemat \`O(n²)\`

Ye lesson: ek loop jismein ek string par \`+=\` hai ek \`O(n)\` copy
chhupaata hai us cheez ke andar jo ek \`O(n)\` loop jaisa dikhta hai
→ asli keemat \`O(n²)\`
\`\`\`

Is lesson ka trap koi naya idea nahi hai — ye bilkul wahi "check karo ki har iteration ka apna body asal mein kya keemat leta hai" siddhaant hai jise is module ke pehle wale loops ka vishleshan karne wale lesson ne pehle hi sthaapit kiya, ek alag, string-khaas operation par lagu kiya gaya. Ek loop ke andar \`Array.prototype.includes()\` ek \`O(n)\` scan chhupaata hai; ek string par \`+=\` ek loop ke andar ek \`O(n)\` copy chhupaata hai — dono dur se "prati iteration ek sasta operation" jaise dikhte hain, aur dono asal mein ek \`O(n)\` operation hain jo \`n\` baar hota hai, ek asli total \`O(n²)\` ke liye. Is dohraaye jaane waale shape ko pehchaanna — ek apparently \`O(1)\` operation jo chupke se \`O(n)\` hai is baat ki wajah se ki underlying data structure asal mein kaise kaam karti hai — ek akela sabse zyaada transferable kaushal hai jise is course ka pehla module banaata hai, kyunki ye lagbhag har data structure par lagu hota hai jo har module mein cover kiya jaata hai jo baad mein aata hai.

## Seedhe concatenation ke bajaye array-and-join kab istemal karein

Ek chhoti, fixed tadaad ke string concatenations (do ya teen khaas pieces ko ek baar saath jodna) sach mein bahut kam kharch karta hai technique ke bhale hi kuch ho, kyunki "sab kuch dobara copy karo" keemat sirf tab mahatvapoorn banti hai jab ye baar-baar chukaayi jaati hai, ek loop ke andar, jaisa is lesson ke toote example ne kiya. Array-and-join pattern khaas taur par apni keemat kamaata hai ek baar string-building ek aise loop ke andar hoti hai jiski iteration count sach mein bada ho sakti hai — ek report line-by-line banaana, kayi chhote pieces se text ka ek bada block assemble karna, ya ek badi algorithm ke kayi iterations ke aar-paar output jama karna. Underlying faisla wahi hai jise is course ka bilkul pehla lesson introduce karta hai: ek technique ki keemat sirf tab maayne rakhti hai jab ye jis data par operate karti hai wo itni badi ho jaaye ki wo keemat mehsoos ho, aur professional aadat ye hai ki ise ek asli samasya banne se pehle check kiya jaaye, baad mein nahi.`,

    examples: [
      {
        title: 'Broken: += inside a loop, hidden O(n²) copy cost',
        titleHi: 'Toota: loop ke andar \`+=\`, chhupi hui O(n²) copy keemat',
        code: `let report = "";
for (let i = 0; i < lines.length; i++) {
  report += lines[i] + "\\n"; // creates a brand-new string every time
}`,
        codeJs: `function buildReport(lines) {
  let report = "";
  for (let i = 0; i < lines.length; i++) {
    report += lines[i] + "\\n";
  }
  return report;
}
// looks like O(n), is actually O(n²) because strings are immutable`,
        codeTs: `function buildReport(lines: string[]): string {
  let report = "";
  for (let i = 0; i < lines.length; i++) {
    report += lines[i] + "\\n";
  }
  return report;
}
// fully valid TypeScript — the hidden cost is not a type error`,
        output: `Instant for 200 lines. Genuinely slow (many seconds) for 200,000
lines — the exact same code, run against more input.`,
        explain: 'Every += creates an entirely new string containing a full copy of everything built so far, making the true total cost O(n²), not the O(n) the loop\'s shape suggests.',
        explainHi: 'Har \`+=\` ek bilkul nayi string banaata hai jismein ab tak banaayi gayi har cheez ki poori copy hai, asli total keemat \`O(n²)\` banaate hue, \`O(n)\` nahi jo loop ki shape sujhaati hai.',
      },
      {
        title: 'Fixed: collect in an array, join once at the end',
        titleHi: 'Theek: ek array mein collect karo, ant mein ek baar jodo',
        code: `const pieces = [];
for (let i = 0; i < lines.length; i++) pieces.push(lines[i]);
return pieces.join("\\n");`,
        codeJs: `function buildReport(lines) {
  const pieces = [];
  for (let i = 0; i < lines.length; i++) {
    pieces.push(lines[i]);
  }
  return pieces.join("\\n");
}
// genuine O(n): each push is O(1), one join at the end is O(n)`,
        codeTs: `function buildReport(lines: string[]): string {
  const pieces: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    pieces.push(lines[i]);
  }
  return pieces.join("\\n");
}`,
        outputJs: `Roughly instant for both 200 lines and 200,000 lines — the total
cost genuinely scales as O(n), not O(n²).`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Pushing onto an array is O(1) per operation, and the one expensive assembly step (.join()) happens exactly once, giving a true O(n) total instead of O(n²).',
        explainHi: 'Ek array mein push karna prati-operation \`O(1)\` hai, aur ek mehenga assembly step (\`.join()\`) bilkul ek baar hota hai, ek asli \`O(n)\` total dete hue \`O(n²)\` ke bajaye.',
      },
      {
        title: 'Confirming strings are immutable: an attempted in-place edit does nothing',
        titleHi: 'Confirm karna ki strings immutable hain: ek koshish ki gayi in-place edit kuch nahi karti',
        code: `let s = "hello";
s[0] = "H";
console.log(s); // still "hello" — the assignment silently did nothing`,
        codeJs: `let s = "hello";
s[0] = "H"; // no error is thrown, but nothing actually happens
console.log(s); // "hello", unchanged

const fixed = "H" + s.slice(1); // this genuinely creates a new string
console.log(fixed); // "Hello"`,
        codeTs: `let s: string = "hello";
// s[0] = "H"; // TypeScript itself flags this as an error:
// "Index signature in type 'string' only permits reading"
const fixed: string = "H" + s.slice(1);
console.log(fixed); // "Hello"`,
        outputJs: `console.log(s) after the attempted in-place edit still prints
"hello" — the assignment to s[0] had no effect at all.`,
        outputTs: `// TypeScript's own type system catches this specific mistake at
// compile time, unlike plain JavaScript, which silently allows and
// ignores the assignment at runtime.`,
        explain: 'Attempting to assign directly to a character index silently does nothing in JavaScript, and is a compile-time type error in TypeScript, since strings do not support in-place modification.',
        explainHi: 'Ek character index ko seedhe assign karne ki koshish karna JavaScript mein chupchaap kuch nahi karta, aur TypeScript mein ek compile-time type error hai, kyunki strings in-place modification support nahi karti.',
      },
    ],

    mistakes: [
      {
        wrong: `let result = "";
for (const item of items) { result += process(item); }
// looks like O(n), silently costs O(n²) due to string immutability`,
        right: `const pieces = [];
for (const item of items) { pieces.push(process(item)); }
const result = pieces.join("");`,
        why: 'Repeated string concatenation inside a loop hides an O(n) full-string copy on every iteration, since strings cannot be modified in place, making the true total cost O(n²).',
        whyHi: 'Ek loop ke andar dohraaya gaya string concatenation har iteration par ek \`O(n)\` poori-string copy chhupaata hai, kyunki strings in place mein modify nahi ki jaa sakti, asli total keemat \`O(n²)\` banaate hue.',
      },
      {
        wrong: `str[0] = "X"; // silently does nothing in JavaScript`,
        right: `str = "X" + str.slice(1); // creates and assigns a genuinely new string`,
        why: 'Strings cannot be modified by index assignment — the operation silently fails in JavaScript rather than throwing an error, making it a genuinely easy mistake to miss.',
        whyHi: 'Strings ko index assignment se modify nahi kiya jaa sakta — operation JavaScript mein chupchaap fail hota hai ek error throw karne ke bajaye, ise ek sach mein aasaan galti banaate hue miss karna.',
      },
      {
        wrong: `// assuming every apparent O(n) loop is genuinely O(n) without
// checking whether its body performs a hidden copy or scan`,
        right: `// explicitly checking each iteration's own cost, whether the
// underlying operation is on an array, a string, or any other
// structure whose own operations are not all O(1)`,
        why: 'The "hidden nested cost inside a loop" trap applies to any data structure whose seemingly simple operations are not actually O(1) — arrays with .includes(), and strings with +=, are two specific instances of one general pattern.',
        whyHi: '"Loop ke andar chhupi hui nested keemat" wala trap kisi bhi data structure par lagu hota hai jiske apparently saadhe operations asal mein \`O(1)\` nahi hote — \`.includes()\` waale arrays, aur \`+=\` waali strings, ek general pattern ke do khaas udaharan hain.',
      },
    ],

    realWorld: [
      {
        en: '**Building large strings efficiently via array-collect-then-join, rather than repeated concatenation, is a genuinely standard, widely documented performance pattern in real production JavaScript codebases.**',
        hi: '**Bade strings ko kushalta se array-collect-phir-join ke zariye banaana, dohraaye gaye concatenation ke bajaye, asli production JavaScript codebases mein ek sach mein standard, widely documented performance pattern hai.**',
      },
      {
        en: '**String immutability is a deliberate, well-documented language design choice shared across JavaScript, Python, Java, and most mainstream languages** — not an implementation quirk specific to any single one of them.',
        hi: '**String immutability ek jaan-boojhkar liya gaya, achhi tarah documented language design faisla hai jo JavaScript, Python, Java, aur adhikaansh mainstream bhaashaon mein share kiya jaata hai** — kisi ek ke liye khaas koi implementation quirk nahi.',
      },
      {
        en: '**Report-generation, log-aggregation, and large-text-assembly features are the real-world scenarios where this specific O(n²) trap most commonly causes a genuine, measurable production slowdown.**',
        hi: '**Report-generation, log-aggregation, aur large-text-assembly features asli-duniya scenarios hain jahan ye khaas \`O(n²)\` trap sabse aam taur par ek asli, naapa-jaane-laayak production slowdown ka kaaran banta hai.**',
      },
    ],

    interviewQA: [
      {
        q: 'Why does repeatedly concatenating strings with += inside a loop cost O(n²) rather than O(n), despite the loop itself only iterating n times?',
        qHi: 'Ek loop ke andar \`+=\` se strings ko dohraaya-jaakar concatenate karna \`O(n²)\` kyun kharch karta hai \`O(n)\` nahi, is baat ke bawajood ki loop khud sirf \`n\` baar iterate karta hai?',
        a: 'In JavaScript and most mainstream languages, a string, once created, cannot actually be modified — every operation that appears to change a string, including the += operator, does not extend the existing string\'s own memory in place. Instead, it allocates an entirely new string, copies every character the original string already held into that new string, appends the new piece being added, and then reassigns the variable to point at this newly created string, leaving the original, now-unreferenced string to be discarded. This means the actual cost of a single += operation is not a small, fixed amount of work — it is proportional to the length of the string BEING APPENDED TO, since that entire existing content must be copied over into the new string every single time. On the first iteration of a loop building up a string this way, the string is still short, so this copy is cheap. By partway through the loop, however, the accumulated string may already hold a substantial number of characters, and each subsequent += must copy all of those existing characters into a new string before the small new piece is added — meaning the cost of each individual += grows in direct proportion to how far along the loop already is. Summing this growing per-iteration cost across all n iterations of the loop — the first iteration costing roughly 1 unit of copying, the second costing roughly 2, and so on up to roughly n — produces a total cost proportional to n multiplied by n, which is exactly O(n²), despite the loop\'s own iteration count being a completely ordinary O(n). The loop itself is not the source of the extra cost; the hidden O(n) copy performed by the immutable string\'s own += operation, occurring inside that loop, is.',
        aHi: 'JavaScript aur adhikaansh mainstream bhaashaon mein, ek string, ek baar banaayi jaane par, asal mein modify nahi ki jaa sakti — har operation jo ek string ko badalta hua dikhta hai, \`+=\` operator sameet, maujood string ki apni memory ko in place mein extend nahi karta. Iske bajaye, ye ek bilkul-nayi string allocate karta hai, asli string mein pehle se maujood har character ko us nayi string mein copy karta hai, jodi jaa rahi nayi tukda append karta hai, aur phir variable ko is nayi banaayi gayi string ki taraf point karne ke liye reassign karta hai, asli, ab-na-reference-ki-gayi string ko hataaye jaane ke liye chhodte hue. Iska matlab hai ki ek akele \`+=\` operation ki asli keemat ek chhota, fixed kaam nahi hai — ye us string ki lambaayi ke anupaat mein hai JISME APPEND KIYA JAA RAHA HAI, kyunki wo poori maujood content har akeli baar us nayi string mein copy ki jaani chahiye. Loop ki pehli iteration par jo is tarike se ek string banaata hai, string abhi bhi chhoti hai, isliye ye copy sasta hai. Loop ke aadhe raaste tak, halaanki, jama hui string shaayad pehle se kaafi tadaad mein characters rakhti ho, aur har baad ka \`+=\` un sab maujood characters ko ek nayi string mein copy karna chahiye chhota naya tukda jodne se pehle — matlab har akele \`+=\` ki keemat is baat ke seedhe anupaat mein badhti hai ki loop pehle se kitna aage badh chuka hai. Loop ki sab \`n\` iterations ke aar-paar is badhti hui prati-iteration keemat ko jodna — pehli iteration lagbhag 1 unit copying kharch karti hai, doosri lagbhag 2, aur aise hi lagbhag \`n\` tak — ek total keemat banaata hai jo \`n\` ko \`n\` se guna kiye gaye ke anupaat mein hai, jo bilkul \`O(n²)\` hai, is baat ke bawajood ki loop ki apni iteration count ek bilkul saadhaaran \`O(n)\` hai. Loop khud atirikt keemat ka srot nahi hai; immutable string ke apne \`+=\` operation dwara perform ki gayi chhupi hui \`O(n)\` copy, us loop ke andar hoti hui, hai.',
      },
      {
        q: 'What makes the array-collect-then-join pattern genuinely O(n), and why does this differ from what happens when += is used repeatedly?',
        qHi: 'Array-collect-phir-join pattern ko sach mein \`O(n)\` kya banaata hai, aur ye us se kaise alag hai jo hota hai jab \`+=\` ko dohraaya-jaakar istemal kiya jaata hai?',
        a: 'Pushing a new item onto the end of an array is a fundamentally different operation from appending to a string, cost-wise, because arrays, unlike strings, are designed to support efficient growth: a push operation typically costs a small, constant amount of work regardless of how many items the array already holds, since it does not require copying the array\'s existing contents elsewhere (this course\'s later stack module covers the specific mechanism that makes this possible). This means that collecting n pieces into an array via n separate push operations costs a genuine, honest O(n) total — n operations, each costing a small constant amount, sums to O(n), with no hidden multiplication the way string concatenation has. Once every piece has been collected, a single call to a method like .join() is then responsible for actually assembling all of those pieces into one final string. This single join operation does need to touch every character across every piece exactly once, so it costs O(n) on its own — but critically, this cost is paid exactly ONE TIME, after the loop has finished, rather than being paid repeatedly, once per iteration, growing larger each time the way a += inside the loop does. The total cost of the array-collect-then-join approach is therefore the O(n) cost of collecting the pieces, plus the separate O(n) cost of the one final join, which together sum to O(n) (a constant number of O(n) steps performed sequentially still sums to O(n), following the same addition-not-multiplication rule this course\'s earlier lesson on analyzing loops established) — a genuinely different, and dramatically cheaper, total than the O(n²) produced by paying a copy cost that grows on every single iteration of the loop.',
        aHi: 'Ek array ke ant mein ek naya item push karna keemat ke lihaaz se ek string mein jodne se buniyaadi roop se ek alag operation hai, kyunki arrays, strings ke ulta, kushal growth support karne ke liye design kiye gaye hain: ek push operation aksar ek chhota, constant kaam kharch karta hai chahe array pehle se kitne bhi items rakhta ho, kyunki ise array ki maujood contents ko kahin aur copy karne ki zaroorat nahi hoti (is course ka baad ka stack module bilkul us mechanism ko cover karta hai jo ise mumkin banaata hai). Iska matlab hai ki \`n\` pieces ko \`n\` alag push operations ke zariye ek array mein collect karna ek asli, honest \`O(n)\` total kharch karta hai — \`n\` operations, har ek ek chhota constant kharch karte hue, \`O(n)\` mein sum hote hain, string concatenation jaisa koi chhupa hua multiplication nahi. Ek baar har piece collect ho jaaye, ek akeli call \`.join()\` jaise method ko phir un sab pieces ko ek aakhri string mein asal mein assemble karne ke liye jimmedaar hai. Ye akela join operation har piece ke aar-paar har character ko bilkul ek baar chhuna chahiye, isliye ye khud \`O(n)\` kharch karta hai — par mahatvapoorn baat, ye keemat bilkul EK BAAR chukaayi jaati hai, loop khatam hone ke baad, dohraaye jaane ke bajaye, prati-iteration ek baar, har baar bada hote hue jaisa loop ke andar ek \`+=\` karta hai. Array-collect-phir-join approach ki total keemat isliye pieces collect karne ki \`O(n)\` keemat hai, plus ek aakhri join ki alag \`O(n)\` keemat, jo saath \`O(n)\` mein sum hoti hain (ek constant tadaad ke \`O(n)\` steps jo sequentially perform kiye jaate hain phir bhi \`O(n)\` mein sum hote hain, is course ke pehle wale loops ka vishleshan karne wale lesson dwara sthaapit usi addition-not-multiplication rule ka palan karte hue) — ek sach mein alag, aur naatakiya roop se sasta, total us \`O(n²)\` se jo loop ki har akeli iteration par badhti hui copy keemat chukaake banta hai.',
      },
    ],

    exercises: [
      {
        task: 'Build both the broken (+= in a loop) and fixed (array-collect-then-join) buildReport functions from this lesson. Time both with an array of 200 lines, then 200,000 lines, using console.time/console.timeEnd.',
        taskHi: 'Is lesson ke toote (loop mein \`+=\`) aur theek (array-collect-phir-join) \`buildReport\` functions dono banao. Dono ko 200 lines ke ek array ke saath, phir 200,000 lines ke saath time karo, \`console.time\`/\`console.timeEnd\` istemal karte hue.',
        hint: 'Generate the large test array using Array.from({ length: 200000 }, (_, i) => "line " + i) rather than typing 200,000 lines by hand.',
        hintHi: '\`Array.from({ length: 200000 }, (_, i) => "line " + i)\` istemal karke bada test array banaao, 200,000 lines haath se type karne ke bajaye.',
      },
      {
        task: 'Try to modify a string by assigning directly to a character index in both a plain JavaScript file and a TypeScript file. Confirm and write down the different way each language responds to the same attempted mistake.',
        taskHi: 'Ek string ko seedhe ek character index ko assign karke modify karne ki koshish karo dono ek saadhi JavaScript file mein aur ek TypeScript file mein. Confirm karo aur likho ki har bhaasha usi koshish ki gayi galti ka alag tarike se kaise jawaab deti hai.',
        hint: 'JavaScript will not throw any error at all; TypeScript\'s own compiler should flag the assignment before the code even runs.',
        hintHi: 'JavaScript koi error bilkul throw nahi karegi; TypeScript ka apna compiler ko assignment ko code chalne se pehle hi flag karna chahiye.',
      },
      {
        task: 'Find one place in code you have written before (in this course or elsewhere) where a string was built up using += inside a loop. Rewrite it using the array-collect-then-join pattern from this lesson.',
        taskHi: 'Code mein ek jagah dhoondho jo tumne pehle likha hai (is course mein ya kahin aur) jahan ek string \`+=\` istemal karke ek loop ke andar banaayi gayi. Ise is lesson ke array-collect-phir-join pattern istemal karke dobara likho.',
        hint: 'A common place to find this pattern is inside code that builds up HTML strings, log messages, or CSV rows one piece at a time.',
        hintHi: 'Is pattern ko dhoondhne ki ek aam jagah aisa code hai jo HTML strings, log messages, ya CSV rows ek waqt mein ek tukda banaata hai.',
      },
    ],

    keyTakeaways: [
      'Strings are immutable in JavaScript and most mainstream languages — every operation that appears to modify a string actually creates an entirely new one, leaving the original unchanged.',
      'Repeatedly concatenating with += inside a loop hides an O(n) full-string copy on every single iteration, making the true total cost O(n²), despite the loop itself only iterating n times.',
      'Attempting to assign directly to a string\'s character index silently does nothing in JavaScript, and is caught as a compile-time error in TypeScript.',
      'Collecting pieces in an array (O(1) per push) and joining once at the end (a single O(n) operation) gives a genuine O(n) total, avoiding the hidden nested cost of repeated concatenation.',
      'This lesson\'s trap is the same underlying pattern as this module\'s earlier hidden-scan-inside-a-loop lesson, applied to strings instead of arrays — recognizing this recurring shape transfers across every data structure covered later in this course.',
      'A technique\'s hidden cost only matters once the data it processes grows large enough to feel it — the professional habit is checking for hidden per-iteration costs before shipping, not after a real slowdown appears.',
    ],
    keyTakeawaysHi: [
      'Strings JavaScript aur adhikaansh mainstream bhaashaon mein immutable hain — har operation jo ek string ko modify karta hua dikhta hai asal mein ek bilkul-nayi banaata hai, asli ko na-badla chhodte hue.',
      'Ek loop ke andar \`+=\` se dohraaya-jaakar concatenate karna har akeli iteration par ek \`O(n)\` poori-string copy chhupaata hai, asli total keemat \`O(n²)\` banaate hue, is baat ke bawajood ki loop khud sirf \`n\` baar iterate karta hai.',
      'Ek string ke character index ko seedhe assign karne ki koshish karna JavaScript mein chupchaap kuch nahi karta, aur TypeScript mein ek compile-time error ki tarah pakda jaata hai.',
      'Pieces ko ek array mein collect karna (\`O(1)\` prati-push) aur ant mein ek baar jodna (ek akela \`O(n)\` operation) ek asli \`O(n)\` total deta hai, dohraaye gaye concatenation ki chhupi hui nested keemat se bachte hue.',
      'Is lesson ka trap is module ke pehle wale hidden-scan-inside-a-loop lesson jaisa hi underlying pattern hai, arrays ke bajaye strings par lagu kiya gaya — is dohraaye jaane waale shape ko pehchaanna is course mein baad mein cover ki gayi har data structure tak transfer hota hai.',
      'Ek technique ki chhupi hui keemat sirf tab maayne rakhti hai jab jis data ko ye process karti hai wo itna bada ho jaaye ki use mehsoos kiya jaa sake — professional aadat ye hai ki ship karne se pehle chhupi hui prati-iteration keemat check ki jaaye, ek asli slowdown dikhne ke baad nahi.',
    ],
  },
];
