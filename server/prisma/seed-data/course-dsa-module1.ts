/**
 * DSA Complete Course — Module 1: Foundations, lesson 1.
 *
 * Why data structures and algorithms actually matter, framed around a
 * genuine scale failure: a "find a student by ID" feature that works
 * perfectly in every demo and every small test, then becomes unusably
 * slow the moment the real dataset grows from a few dozen records to a
 * few million — not because the code has a bug, but because the
 * underlying data structure (an unsorted list) and the algorithm
 * scanning it (linear search) were never built to survive that scale.
 * Fixed by choosing a data structure (a hash map) whose own internal
 * organization makes the lookup itself cheap, rather than trying to
 * make the same linear scan run faster. This lesson also previews this
 * course's own throughline: a "data structure" is a way of organizing
 * data to make certain operations cheap, an "algorithm" is a step-by-step
 * procedure for solving a problem, and choosing the right DATA STRUCTURE
 * is usually the single biggest algorithmic decision made before a
 * single line of the actual algorithm is even written.
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

export const DSA_MODULE_1: CourseLesson[] = [
  {
    slug: 'why-dsa-matters',
    title: 'Why Data Structures and Algorithms Actually Matter',
    titleHi: 'Data Structures Aur Algorithms Asal Mein Kyun Maayne Rakhte Hain',
    description: 'A "find student by ID" feature passes every test with 40 sample students and ships to production. Six months later, with 4 million real student records, looking up a single student now takes 11 seconds — the code never changed; the data simply grew past what the approach could survive.',
    descriptionHi: 'Ek "student ko ID se dhoondho" feature 40 sample students ke saath har test paas karta hai aur production mein ship hota hai. Chhe mahine baad, 4 million asli student records ke saath, ek akele student ko dhoondhna ab 11 second leta hai — code kabhi nahi badla; data bas us approach se aage badh gaya jise wo jhel sakta tha.',
    difficulty: 'EASY',
    duration: 18,
    order: 1,

    analogy: {
      en: '**A single clerk in a tiny village post office who knows all 40 residents by face, versus that same single clerk, using the exact same method, trying to find one specific customer\'s file inside a warehouse holding 4 million unsorted paper folders piled in no particular order.** In the tiny village, "just look through the folders until you find the right one" genuinely works fine — there are only 40 of them, so even in the worst case, checking every single one takes moments. The clerk\'s METHOD did not change at all when the post office grew into a regional distribution hub processing millions of records — it is still "start at the first folder and check them one by one until you find a match" — but the amount of TIME that method takes has grown in direct proportion to how many folders now exist, and at 4 million folders, checking every single one before finding the right customer is not a minor inconvenience anymore, it is a genuine, business-halting problem. The actual fix was never going to be "have the clerk move faster" — a faster clerk still has to check millions of folders in the worst case. The real fix is organizing the warehouse itself differently: alphabetized folders letting the clerk jump directly toward the right section, or better still, a card-catalog index mapping each customer\'s name directly to their folder\'s exact shelf location, so finding any single folder takes roughly the same, small amount of time regardless of whether the warehouse holds 40 folders or 40 million. Data structures are exactly this: decisions about how information is organized, made BEFORE any searching or processing happens, that determine whether an operation stays fast as the amount of data grows, or degrades right alongside it.',
      hi: '**Ek chhote se village post office mein ek akela clerk jo sab 40 residents ko chehre se jaanta hai, versus wahi akela clerk, bilkul usi tarike se, ek khaas customer ki file dhoondhne ki koshish karte hue ek warehouse ke andar jismein 4 million bina-sorted kaagaz ke folders bina kisi khaas order ke dhere lage hain.** Chhote village mein, "bas folders mein tab tak dekho jab tak sahi wala na mile" sach mein achhi tarah kaam karta hai — sirf 40 hi hain, isliye sabse bure case mein bhi, har ek check karna kuch pal leta hai. Clerk ka TARIKA bilkul nahi badla jab post office ek regional distribution hub mein badal gaya jo millions records process karta hai — ye abhi bhi "pehle folder se shuru karo aur ek-ek karke check karo jab tak match na mile" hai — par jitna TIME wo tarika leta hai wo seedha is baat ke anupaat mein badh gaya hai ki abhi kitne folders maujood hain, aur 4 million folders par, sahi customer milne se pehle har ek check karna ab ek chhoti asuvidha nahi hai, ye ek asli, business-rokne-waali samasya hai. Asli fix kabhi "clerk ko tez chalao" hone waala nahi tha — ek tez clerk ko phir bhi sabse bure case mein millions folders check karne padte hain. Asli fix warehouse ko khud alag tarike se organize karna hai: alphabetize kiye gaye folders clerk ko seedhe sahi section ki taraf jump karne dete hue, ya aur behtar, ek card-catalog index jo har customer ke naam ko seedhe unke folder ki asli shelf location se map karta hai, taaki koi bhi akela folder dhoondhna lagbhag samaan, chhota samay le chahe warehouse mein 40 folders hon ya 40 million. Data structures bilkul yahi hain: jaankaari kaise organize ki gayi hai iske baare mein faisle, kisi bhi khoj ya processing hone se PEHLE liye jaate hain, jo tay karte hain ki ek operation data badhne ke saath tez rehta hai, ya usi ke saath girawat mein aata hai.',
    },

    simple: `**Start broken.** A "find student by ID" feature that scans every record, one at a time:

\`\`\`js
const students = loadAllStudents(); // an ordinary array, in whatever order they were added

function findStudent(id) {
  for (let i = 0; i < students.length; i++) {
    if (students[i].id === id) {
      return students[i];
    }
  }
  return null; // not found
}
\`\`\`

With 40 students in a school\'s pilot program, this works instantly — the worst case is scanning 40 items, which any computer does in a fraction of a millisecond, so nobody ever notices a problem, and the feature ships. The exact same code is then run against the real, full dataset: 4 million student records across an entire district. The function itself has not changed one bit, but now, in the worst case (looking up a student whose record happens to be near the end, or one that does not exist at all), the loop must check all 4 million entries, one at a time, before it can return an answer. This is not a bug in the traditional sense — there is no typo, no wrong operator, nothing a debugger would flag as "incorrect" — the code does exactly what it was written to do. The actual problem is that an approach whose cost grows in direct proportion to how much data exists (this is what this course\'s next lesson calls its "time complexity") was chosen without ever considering how large the data would eventually become.

**The fix: choose a data structure whose own organization makes the lookup itself cheap**

\`\`\`js
const studentsById = new Map(); // organize BY id, not just in load order
for (const student of loadAllStudents()) {
  studentsById.set(student.id, student);
}

function findStudent(id) {
  return studentsById.get(id) ?? null; // no scanning at all
}
\`\`\`

\`\`\`ts
const studentsById = new Map<string, Student>();
for (const student of loadAllStudents()) {
  studentsById.set(student.id, student);
}

function findStudent(id: string): Student | null {
  return studentsById.get(id) ?? null;
}
\`\`\`

A \`Map\` (this course\'s next module covers exactly how it works internally) organizes its entries so that looking one up by its key does not require checking every other entry first — finding one specific student\'s record costs roughly the same small amount of work whether \`studentsById\` holds 40 entries or 4 million. Nothing about how FAST the computer runs individual instructions changed between the two versions; what changed is the ORGANIZATION of the data itself, decided before a single lookup ever happens, which is the entire point of learning data structures deliberately rather than reaching for whatever container happens to be closest at hand.`,

    simpleHi: `**Toote hue se shuru.** Ek "student ko ID se dhoondho" feature jo har record ko ek-ek karke scan karta hai:

\`\`\`js
const students = loadAllStudents(); // ek saadhaaran array, jis order mein jode gaye the usi mein

function findStudent(id) {
  for (let i = 0; i < students.length; i++) {
    if (students[i].id === id) {
      return students[i];
    }
  }
  return null; // nahi mila
}
\`\`\`

Ek school ke pilot program mein 40 students ke saath, ye turant kaam karta hai — sabse bura case 40 items scan karna hai, jo koi bhi computer ek millisecond ke chhote hisse mein karta hai, isliye koi bhi kabhi kisi samasya ko notice nahi karta, aur feature ship hota hai. Bilkul wahi code phir asli, poore dataset ke khilaaf chalaayi jaati hai: poore district ke aar-paar 4 million student records. Function khud ek bhi bit nahi badla, par ab, sabse bure case mein (ek student ko dhoondhna jiska record samyog se ant ke kareeb hai, ya ek jo bilkul maujood nahi hai), loop ko sab 4 million entries check karni padti hain, ek-ek karke, isse pehle ki ye ek jawaab de sake. Ye traditional arth mein ek bug nahi hai — koi typo nahi, koi galat operator nahi, kuch nahi jise ek debugger "galat" flag karega — code bilkul wahi karta hai jo likhne ke liye tha. Asli samasya ye hai ki ek aisa approach jiski keemat seedhe is baat ke anupaat mein badhti hai ki kitna data maujood hai (ye wo hai jise is course ka agla lesson iska "time complexity" kehta hai) bina kabhi ye vichaar kiye chuna gaya ki data aakhirkaar kitna bada ho jaayega.

**Fix: ek data structure chuno jiska apna organization lookup ko khud sasta banaata hai**

\`\`\`js
const studentsById = new Map(); // id SE organize karo, sirf load order mein nahi
for (const student of loadAllStudents()) {
  studentsById.set(student.id, student);
}

function findStudent(id) {
  return studentsById.get(id) ?? null; // koi scanning bilkul nahi
}
\`\`\`

\`\`\`ts
const studentsById = new Map<string, Student>();
for (const student of loadAllStudents()) {
  studentsById.set(student.id, student);
}

function findStudent(id: string): Student | null {
  return studentsById.get(id) ?? null;
}
\`\`\`

Ek \`Map\` (is course ka agla module bilkul batata hai ki ye internally kaise kaam karta hai) apni entries ko is tarike se organize karta hai ki unhe unke key se dhoondhna baaki har entry pehle check karne ki zaroorat nahi rakhta — ek khaas student ka record dhoondhna lagbhag samaan chhota kaam leta hai chahe \`studentsById\` mein 40 entries hon ya 4 million. Computer individual instructions kitni TEZ chalaata hai iske baare mein kuch bhi do versions ke beech nahi badla; jo badla wo data ka ORGANIZATION khud hai, kisi bhi lookup hone se pehle tay kiya gaya, jo data structures ko jaan-boojhkar seekhne ka poora point hai jo bhi container haath ke sabse kareeb hai use pakadne ke bajaye.`,

    content: `## What a "data structure" and an "algorithm" each actually are

A **data structure** is a specific way of organizing data in memory so that certain operations on it — looking something up, inserting something new, removing something, finding the largest or smallest item — can be done efficiently. An **algorithm** is a step-by-step procedure for solving a problem, independent of how the underlying data happens to be organized. These two ideas are almost never actually separate in practice: the SAME algorithmic goal ("find a student by ID") costs a wildly different amount of work depending on which data structure is holding the data, which is exactly what this lesson\'s broken and fixed examples demonstrated. This course teaches data structures and algorithms together, in that order, specifically because choosing the right data structure is very often the single biggest decision that determines how good or bad every algorithm operating on that data can possibly be.

## Why "it worked in my testing" is not evidence it will keep working

\`\`\`
40 records:        linear scan feels instant  — nobody notices a problem
40,000 records:     linear scan takes a moment — maybe still tolerable
4,000,000 records:  linear scan takes seconds  — now a real, visible problem
\`\`\`

The single most common way a data-structure-and-algorithm mistake actually surfaces in a real job is exactly the shape of this lesson\'s broken example: code that is entirely correct, passes every test written against it, and behaves perfectly reasonably during development and in early production, because the data available at that stage is still small enough that even a genuinely poor approach feels instant. The problem is not detectable by running the code and checking whether the output is right — the output IS right, every time, at every data size. The problem is only detectable by asking a different question entirely: as the data this code will eventually operate on grows by 10x, or 100x, or 1000x, does the AMOUNT OF WORK this code does grow at the same rate, a slower rate, or a faster rate? This course\'s next lesson gives this question a precise, standard vocabulary (Big-O notation), but the underlying habit — asking "how does this scale?" before shipping something, not after a real user complains — is the actual professional skill this entire course exists to build.

## This course\'s approach: pattern recognition, not memorizing 500 individual problems

A genuinely common, and genuinely mistaken, way to approach learning data structures and algorithms is treating it as memorizing the solution to as many individual practice problems as possible, in the hope that an interview or a real job will happen to ask something similar enough to recall. This course is built around the opposite premise: there are a comparatively small number of genuinely reusable PATTERNS (two pointers, sliding window, breadth-first search, dynamic programming, and so on) that, once actually understood, correctly recognize and apply to a huge range of problems that look completely different on the surface but share the same underlying shape. Each module in this course teaches one such pattern or structure deeply — not just the mechanics of how it works, but how to RECOGNIZE, from a problem\'s own description, that this is the pattern it actually calls for, and how to reason through applying it from scratch rather than recalling a memorized solution.`,

    contentHi: `## Ek "data structure" aur ek "algorithm" asal mein kya hain

Ek **data structure** data ko memory mein organize karne ka ek khaas tarika hai taaki ispar kuch operations — kuch dhoondhna, kuch naya insert karna, kuch hataana, sabse bada ya sabse chhota item dhoondhna — kushalta se kiye jaa sakein. Ek **algorithm** ek problem sulajhaane ka ek step-by-step tarika hai, underlying data samyog se kaise organize hai us se azaad. Ye do ideas practice mein lagbhag kabhi asal mein alag nahi hote: WAHI algorithmic maksad ("student ko ID se dhoondho") ek bahut alag tadaad ka kaam leta hai is baat par nirbhar karte hue ki data ko kaunsi data structure rakhti hai, jo bilkul wo hai jo is lesson ke toote aur theek examples ne darsaaya. Ye course data structures aur algorithms ko saath sikhaata hai, usi order mein, khaas taur par isliye kyunki sahi data structure chunna aksar akela sabse bada faisla hota hai jo tay karta hai ki us data par kaam karta har algorithm kitna achha ya kharaab ho sakta hai.

## "Mere testing mein kaam kiya" iska saboot kyun nahi hai ki ye kaam karta rahega

\`\`\`
40 records:        linear scan turant mehsoos hota hai  — koi bhi samasya notice nahi karta
40,000 records:     linear scan ek pal leta hai — shaayad abhi bhi sahansheel
4,000,000 records:  linear scan seconds leta hai  — ab ek asli, drishyaman samasya
\`\`\`

Ek asli job mein ek data-structure-aur-algorithm galti asal mein saamne aane ka sabse aam tarika bilkul is lesson ke toote example ki shakl hai: code jo poori tarah sahi hai, uske khilaaf likha gaya har test paas karta hai, aur development ke dauraan aur shuruaati production mein poori tarah vaajbi vyavahaar karta hai, kyunki us stage par upalabdh data abhi bhi itna chhota hai ki ek sach mein kharaab approach bhi turant mehsoos hota hai. Samasya code chalaake aur ye check karke pata nahi lagaayi jaa sakti ki output sahi hai ya nahi — output SAHI HAI, har baar, har data size par. Samasya sirf ek bilkul alag sawaal poochh kar pata lagaayi jaa sakti hai: jaise data jispar ye code aakhirkaar kaam karega 10x, ya 100x, ya 1000x badhta hai, kya is code ka KAAM KI TADAAD usi dar se, ek dheemi dar se, ya ek tezi dar se badhta hai? Is course ka agla lesson is sawaal ko ek sateek, standard vocabulary deta hai (Big-O notation), par underlying aadat — kuch ship karne se pehle "ye kaise scale karta hai?" poochhna, ek asli user ke shikaayat karne ke baad nahi — asli professional kaushal hai jise ye poora course banaane ke liye maujood hai.

## Is course ka approach: pattern recognition, 500 akele problems yaad karna nahi

Data structures aur algorithms seekhne ka ek sach mein aam, aur sach mein galat, tarika ise jitne zyaada ho sake akele practice problems ke solution yaad karne ki tarah treat karna hai, is ummeed mein ki ek interview ya ek asli job samyog se kuch itna milta-julta poochhegi ki yaad kiya jaa sake. Ye course ulta dhaarna ke aas-paas banaayi gayi hai: kuch taulanaatmak roop se kam genuinely reusable PATTERNS hain (two pointers, sliding window, breadth-first search, dynamic programming, waghaira) jo, ek baar asal mein samajh liye jaayein, ek vishaal range ki problems ko sahi tarike se pehchaanti aur lagu karti hain jo satah par bilkul alag dikhti hain par wahi underlying shape share karti hain. Is course ka har module aisi ek pattern ya structure ko gehraayi se sikhaata hai — sirf ye ki ye kaise kaam karta hai ki mechanics nahi, balki ek problem ke apne description se ye kaise PEHCHAANNA hai ki isse yahi pattern chahiye, aur ek yaad ki gayi solution ko yaad karne ke bajaye shuru se ise lagu karne ka tark kaise karna hai.`,

    examples: [
      {
        title: 'Broken: a linear scan that costs more as data grows',
        titleHi: 'Toota: ek linear scan jo data badhne ke saath zyaada keemat leta hai',
        code: `for (let i = 0; i < students.length; i++) {
  if (students[i].id === id) return students[i];
}
// checks every entry, one at a time, in the worst case`,
        codeJs: `const students = loadAllStudents();

function findStudent(id) {
  for (let i = 0; i < students.length; i++) {
    if (students[i].id === id) {
      return students[i];
    }
  }
  return null;
}
// with 4 million students, a worst-case lookup checks all 4 million`,
        codeTs: `interface Student {
  id: string;
  name: string;
}

const students: Student[] = loadAllStudents();

function findStudent(id: string): Student | null {
  for (let i = 0; i < students.length; i++) {
    if (students[i].id === id) {
      return students[i];
    }
  }
  return null;
}
// fully valid TypeScript — the slowdown is architectural, not a type error`,
        output: `Instant with 40 students. Multi-second delay per lookup with
4 million — the exact same code, run against more data.`,
        explain: 'The amount of work this function does grows in direct proportion to how many students exist, since nothing about how the data is organized lets the search skip ahead.',
        explainHi: 'Ye function jo kaam karta hai uski tadaad seedhe is baat ke anupaat mein badhti hai ki kitne students maujood hain, kyunki data kaise organize hai iske baare mein kuch bhi search ko aage kudne nahi deta.',
      },
      {
        title: 'Fixed: a Map organized by the exact key being looked up',
        titleHi: 'Theek: dhoondhi jaa rahi asli key se organize kiya gaya ek Map',
        code: `const studentsById = new Map();
for (const s of students) studentsById.set(s.id, s);
function findStudent(id) { return studentsById.get(id) ?? null; }`,
        codeJs: `const studentsById = new Map();
for (const student of loadAllStudents()) {
  studentsById.set(student.id, student);
}

function findStudent(id) {
  return studentsById.get(id) ?? null;
}`,
        codeTs: `interface Student {
  id: string;
  name: string;
}

const studentsById = new Map<string, Student>();
for (const student of loadAllStudents()) {
  studentsById.set(student.id, student);
}

function findStudent(id: string): Student | null {
  return studentsById.get(id) ?? null;
}`,
        outputJs: `Roughly instant whether studentsById holds 40 entries or 4 million
— the lookup cost no longer grows with the amount of data.`,
        outputTs: `// Identical behaviour. Map<string, Student> gives .get() a
// correctly typed return of Student | undefined.`,
        explain: 'The Map\'s own internal organization (covered in this course\'s next module) makes looking up a single key cheap regardless of how many total entries exist.',
        explainHi: '\`Map\` ka apna internal organization (is course ke agle module mein cover kiya gaya) ek akeli key dhoondhna sasta banaata hai chahe kitni bhi total entries maujood hon.',
      },
      {
        title: 'Same goal, different cost: comparing the two approaches directly',
        titleHi: 'Wahi maksad, alag keemat: dono approaches ki seedhi tulna',
        code: `// Both functions answer the exact same question: "does this ID exist?"
// One costs more as data grows. One does not. The code calling them is identical.`,
        codeJs: `function findStudentLinear(students, id) {
  for (let i = 0; i < students.length; i++) {
    if (students[i].id === id) return students[i];
  }
  return null;
}

function findStudentMap(studentsById, id) {
  return studentsById.get(id) ?? null;
}
// both are called the exact same way: findStudentX(data, "12345")`,
        codeTs: `interface Student { id: string; name: string; }

function findStudentLinear(students: Student[], id: string): Student | null {
  for (let i = 0; i < students.length; i++) {
    if (students[i].id === id) return students[i];
  }
  return null;
}

function findStudentMap(studentsById: Map<string, Student>, id: string): Student | null {
  return studentsById.get(id) ?? null;
}`,
        outputJs: `Both return identical results for identical inputs. Only the
amount of work required to produce that result differs, and only
that difference is what this entire course is about measuring
and improving.`,
        outputTs: `// Identical behaviour. Both functions have identical, correct
// signatures — TypeScript cannot see or express the difference
// in how much work each one does internally.`,
        explain: 'Correctness (does it return the right answer) and efficiency (how much work does it take to get there) are two genuinely separate questions — this course is fundamentally about the second one.',
        explainHi: 'Sahihata (kya ye sahi jawaab return karta hai) aur kushalta (wahaan pahunchne mein kitna kaam lagta hai) do sach mein alag sawaal hain — ye course buniyaadi roop se doosre ke baare mein hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// choosing whatever container is closest at hand (usually an array)
// without asking how much data this will eventually hold`,
        right: `// asking, before writing the lookup logic: "how many of these will
// there realistically be, and does this operation need to stay fast
// as that number grows?"`,
        why: 'A data structure decision made without considering eventual scale is the single most common root cause of code that works perfectly in development and fails only in production.',
        whyHi: 'Ek data structure faisla jo aakhirkaar scale ko vichaar kiye bina liya jaata hai us code ka sabse aam mool kaaran hai jo development mein poori tarah kaam karta hai aur sirf production mein fail hota hai.',
      },
      {
        wrong: `// testing only with a handful of sample records and concluding
// the approach is "fast enough" based on that alone`,
        right: `// explicitly reasoning about how the code's own cost grows as the
// data grows, independent of how fast it happens to run on today's
// small test data`,
        why: 'A small test dataset can make almost any approach, including a genuinely poor one, look instant — passing tests is evidence of correctness, not evidence of scalability.',
        whyHi: 'Ek chhota test dataset lagbhag kisi bhi approach ko, ek sach mein kharaab wale ko bhi, turant dikha sakta hai — tests paas karna sahihata ka saboot hai, scalability ka nahi.',
      },
      {
        wrong: `// memorizing the exact solution to hundreds of individual practice
// problems, hoping a real problem will match one closely enough`,
        right: `// learning the underlying pattern each problem actually calls for,
// so a genuinely new problem can still be reasoned through from scratch`,
        why: 'A memorized solution to one specific problem does not transfer to a differently-worded problem that shares the same underlying pattern — recognizing the pattern itself does.',
        whyHi: 'Ek khaas problem ka yaad kiya gaya solution ek alag-shabdon-mein-likhi problem tak transfer nahi hota jo wahi underlying pattern share karti hai — khud pattern ko pehchaanna hota hai.',
      },
    ],

    realWorld: [
      {
        en: '**"Works fine in the demo, falls over in production once real data volume hits it" is one of the single most commonly cited real-world engineering incidents**, and it is very often traced back to exactly this class of data-structure choice, not a logic bug.',
        hi: '**"Demo mein theek kaam karta hai, production mein girta hai jab asli data volume ise hit karta hai" sabse aam taur par cite ki jaane waali asli-duniya engineering incidents mein se ek hai**, aur ye aksar bilkul is class ke data-structure chunaav tak trace ki jaati hai, ek logic bug tak nahi.',
      },
      {
        en: '**Technical interviews at essentially every major software company explicitly test the ability to reason about how an approach scales, not just whether it produces a correct answer on a small example** — this is precisely why this course is structured around patterns and scaling reasoning from lesson one.',
        hi: '**Lagbhag har badi software company mein technical interviews explicitly ye kshamta test karte hain ki ek approach kaise scale karta hai iske baare mein tark kiya jaa sake, sirf ye nahi ki ye ek chhote example par sahi jawaab deta hai** — yahi bilkul wajah hai ki ye course lesson ek se hi patterns aur scaling tark ke aas-paas structure kiya gaya hai.',
      },
      {
        en: '**Map and its close relatives (hash-based structures) are among the most widely used data structures in real production systems specifically because they solve the lookup-cost problem this lesson opened with.**',
        hi: '**\`Map\` aur iske kareebi rishtedaar (hash-based structures) asli production systems mein sabse widely used data structures mein se hain khaas taur par kyunki wo lookup-cost samasya sulajhaate hain jo is lesson ne shuru mein kholi.**',
      },
    ],

    interviewQA: [
      {
        q: 'Why can code that is entirely bug-free and passes every test still become a serious production problem purely because of the data structure it uses?',
        qHi: 'Code jo poori tarah bug-free hai aur har test paas karta hai sirf isliye ek gambhir production samasya kyun ban sakta hai kyunki ye kaunsi data structure istemal karta hai?',
        a: 'Correctness and efficiency are genuinely independent properties of a piece of code, and testing typically verifies only the first one. A test suite checks whether a function returns the right answer for a given set of inputs, and a function built around a linear scan through an array will return the exactly correct answer every single time it is run, at any data size at all — there is no data size at which a linear scan produces a wrong result, so no correctness test will ever fail because of it. What a typical test suite does not check, and often cannot check without deliberately constructing an enormous dataset specifically to look for this, is how the AMOUNT OF WORK required to produce that correct answer changes as the data grows. A linear scan\'s cost grows in direct, linear proportion to the number of items it must potentially check, meaning that at a small scale (dozens or hundreds of records, the kind of dataset commonly used in development and testing), the actual time taken is so small it is imperceptible, and every test passes quickly and cleanly. As the real data a system operates on grows toward the scale of a genuine production environment (thousands, then millions of records), that same linear relationship means the actual time taken grows right alongside it, eventually crossing from "imperceptible" into "a multi-second delay a real user directly experiences," despite the underlying code never having changed at all and every unit test still passing exactly as it always did. This is precisely why reasoning about how an approach\'s cost scales with data size — the subject of this course\'s very next lesson — has to be treated as a genuinely separate concern from correctness testing, evaluated deliberately rather than assumed to be fine simply because the existing test suite is green.',
        aHi: 'Sahihata aur kushalta code ke ek tukde ki sach mein azaad properties hain, aur testing aksar sirf pehli ko verify karti hai. Ek test suite check karta hai ki ek function inputs ke ek diye gaye set ke liye sahi jawaab return karta hai ya nahi, aur ek function jo ek array ke through ek linear scan ke aas-paas banaayi gayi hai bilkul sahi jawaab return karega har akeli baar jab ye chalaaya jaata hai, kisi bhi data size par bhi — koi aisa data size nahi hai jispar ek linear scan ek galat nateeja deta hai, isliye koi bhi sahihata test kabhi iski wajah se fail nahi hoga. Ek typical test suite kya check nahi karta, aur aksar bina jaan-boojhkar ek vishaal dataset banaaye khaas taur par ise dhoondhne ke liye nahi kar sakta, ye hai ki us sahi jawaab ko banaane ke liye zaruri KAAM KI TADAAD data badhne ke saath kaise badalti hai. Ek linear scan ki keemat seedhe, linear anupaat mein badhti hai un items ki tadaad ke saath jinhe ye sambhaavit roop se check kar sakta hai, matlab ek chhoti scale par (dozens ya sainkdon records, waisa dataset jo aam taur par development aur testing mein istemal hota hai), asli samay itna chhota hai ki ye adrishya hai, aur har test tez aur saaf paas hota hai. Jaise asli data jispar ek system kaam karta hai ek asli production environment ki scale ki taraf badhta hai (hazaaron, phir millions records), wahi linear rishta matlab hai ki asli samay iske saath saath badhta hai, aakhirkaar "adrishya" se "ek asli user seedhe anubhav karta ek multi-second delay" mein cross karte hue, is baat ke bawajood ki underlying code kabhi bilkul badla nahi aur har unit test abhi bhi bilkul waise paas hota hai jaisa hamesha hota tha. Yahi bilkul wajah hai ki ek approach ki keemat data size ke saath kaise scale karti hai iske baare mein tark karna — is course ke bilkul agle lesson ka vishay — ek sach mein alag chinta ki tarah treat kiya jaana chahiye sahihata testing se, jaan-boojhkar evaluate kiya gaya sirf isliye theek maane bina ki maujood test suite green hai.',
      },
      {
        q: 'Why does this course teach patterns instead of memorized solutions to individual problems, and what is the actual, practical difference between the two approaches?',
        qHi: 'Ye course akele problems ke yaad kiye gaye solutions ke bajaye patterns kyun sikhaata hai, aur dono approaches ke beech asli, vyaavahaarik farak kya hai?',
        a: 'Memorizing the exact solution to a specific problem creates knowledge that is tied entirely to that problem\'s own specific wording and shape — the moment a genuinely new problem is phrased even moderately differently, uses different variable names or a different concrete scenario, or combines two ideas that were previously only ever seen in separate problems, a purely memorized solution provides no help at all, since the memorized knowledge has no mechanism for recognizing that the new problem is actually the same underlying shape wearing different clothes. Learning a pattern instead — understanding, for instance, that a genuinely wide range of array problems become dramatically easier once two pointers are moved toward each other or in the same direction according to a specific, learnable rule — builds a different, more durable kind of knowledge: the ability to look at a new, previously unseen problem\'s actual description and recognize, from its underlying structure rather than its surface wording, which of a comparatively small number of well-understood approaches is likely to apply. This is the practical difference a real interview, or a real unfamiliar problem encountered on the job, actually tests: not whether a specific memorized solution happens to match, which is a matter of luck, but whether the underlying pattern can be recognized and reasoned through from first principles when it does not match anything previously seen verbatim. This course is structured one pattern or data structure per module specifically so that each one can be understood deeply enough to be recognized and applied to problems this course itself never explicitly covers, rather than accumulating an ever-growing list of specific problems whose solutions must each be separately remembered.',
        aHi: 'Ek khaas problem ke bilkul solution ko yaad karna aisa gyaan banaata hai jo poori tarah us problem ke apne khaas shabdon aur shape se juda hai — jis pal ek sach mein nayi problem thodi bhi alag tarike se likhi jaati hai, alag variable names ya ek alag thos scenario istemal karti hai, ya do ideas ko jodti hai jo pehle sirf alag problems mein hi dekhe gaye the, ek shuddh yaad kiya gaya solution bilkul koi madad nahi karta, kyunki yaad kiya gaya gyaan ye pehchaanne ka koi mechanism nahi rakhta ki nayi problem asal mein wahi underlying shape hai alag kapdon mein. Iske bajaye ek pattern seekhna — ye samajhna, misal ke taur par, ki array problems ki ek sach mein vishaal range dramatically aasaan ban jaati hai ek baar do pointers ek doosre ki taraf ya ek hi disha mein ek khaas, seekhne-laayak rule ke anusaar move kiye jaayein — ek alag, zyaada tikaau tarah ka gyaan banaata hai: ek nayi, pehle-na-dekhi problem ke asli description ko dekhne aur pehchaanne ki kshamta, iske surface wording se nahi balki uski underlying structure se, ki taulanaatmak roop se kam achhi-tarah-samjhi-gayi approaches mein se kaunsi lagu hone ki sambhaavna rakhti hai. Ye wo vyaavahaarik farak hai jise ek asli interview, ya job par mila ek asli anjaan problem, asal mein test karta hai: ye nahi ki koi khaas yaad kiya gaya solution samyog se mel khaata hai, jo ek bhaagya ki baat hai, balki ye ki jab wo kisi bhi shabdik roop se pehle dekhi gayi cheez se mel nahi khaati tab bhi underlying pattern ko pehle siddhaanton se pehchaana aur tark kiya jaa sakta hai. Ye course ek pattern ya data structure prati module ke hisaab se structure kiya gaya hai khaas taur par taaki har ek ko itni gehraayi se samjha jaa sake ki ise un problems par pehchaana aur lagu kiya jaa sake jinhe ye course khud kabhi explicitly cover nahi karta, ek hamesha-badhti hui specific problems ki list jama karne ke bajaye jinke solutions har ek ko alag se yaad rakhna chahiye.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken linear-scan example and a version using a Map, following this lesson\'s example. Generate a test array of 10 items, then 1,000,000 items, and time both functions at both sizes using console.time/console.timeEnd.',
        taskHi: 'Toota linear-scan example aur ek \`Map\` istemal karne wala version banao, is lesson ke example ka palan karte hue. 10 items ka ek test array banao, phir 1,000,000 items ka, aur dono functions ko dono sizes par \`console.time\`/\`console.timeEnd\` istemal karke time karo.',
        hint: 'Look up an item near the very end of the array in the worst case, since a linear scan\'s true worst-case cost only shows up when the item being searched for is not near the beginning.',
        hintHi: 'Sabse bure case mein array ke bilkul ant ke kareeb ek item dhoondho, kyunki ek linear scan ki asli sabse-buri-case keemat sirf tab dikhti hai jab dhoondha jaa raha item shuru ke kareeb na ho.',
      },
      {
        task: 'Think of one feature you have personally built or used that worked fine with a small amount of data. Write two or three sentences on what specifically would need to change about its approach if the data grew 1000x.',
        taskHi: 'Ek feature ke baare mein socho jo tumne khud banaaya ya istemal kiya jo thodi si data ke saath theek kaam karta tha. Do ya teen vaakya likho ki agar data 1000x badh jaaye toh iske approach ke baare mein khaas taur par kya badalna chahiye.',
        hint: 'Focus specifically on any place the feature searches, sorts, or compares items against each other — those are the operations most likely to have a cost tied to data size.',
        hintHi: 'Khaas taur par kisi bhi jagah par focus karo jahan feature items ko dhoondhta, sort karta, ya ek doosre se compare karta hai — ye wo operations hain jinki keemat data size se judi hone ki sabse zyaada sambhaavna hai.',
      },
      {
        task: 'Without writing any code, describe in your own words what a "data structure" is and what an "algorithm" is, and explain in one sentence why this course teaches them together rather than as two separate subjects.',
        taskHi: 'Koi bhi code likhe bina, apne khud ke shabdon mein bataao ki ek "data structure" kya hai aur ek "algorithm" kya hai, aur ek vaakya mein samjhaao ki ye course inhe do alag vishay ke bajaye saath kyun sikhaata hai.',
        hint: 'Think back to the warehouse analogy from this lesson\'s opening — the folders\' organization is one idea, and the clerk\'s search method is a separate but related idea.',
        hintHi: 'Is lesson ki shuruaat waali warehouse analogy ko yaad karo — folders ka organization ek idea hai, aur clerk ka search tarika ek alag par judi idea hai.',
      },
    ],

    keyTakeaways: [
      'A data structure is a way of organizing data so certain operations on it are cheap; an algorithm is a step-by-step procedure for solving a problem — the two are almost always chosen together in practice.',
      'Code can be entirely correct, pass every test, and still fail in production purely because the cost of its approach grows too fast as the amount of data grows.',
      'A small test dataset makes almost any approach look instant — passing tests is evidence of correctness, not evidence that an approach will keep working at real scale.',
      'The fix for a scaling problem is very often reorganizing the underlying data structure itself, not making the same operation "faster" through micro-optimization.',
      'This course teaches a comparatively small number of genuinely reusable patterns, one per module, rather than memorized solutions to individual problems, since patterns transfer to new problems and memorized solutions do not.',
      'Asking "how does this scale as the data grows?" before shipping something is the single professional habit this entire course exists to build.',
    ],
    keyTakeawaysHi: [
      'Ek data structure data ko organize karne ka ek tarika hai taaki ispar kuch operations sasta ho; ek algorithm ek problem sulajhaane ka step-by-step tarika hai — ye dono practice mein lagbhag hamesha saath chune jaate hain.',
      'Code poori tarah sahi ho sakta hai, har test paas kar sakta hai, aur phir bhi production mein fail ho sakta hai sirf isliye kyunki uske approach ki keemat data badhne ke saath bahut tez badhti hai.',
      'Ek chhota test dataset lagbhag kisi bhi approach ko turant dikhaata hai — tests paas karna sahihata ka saboot hai, iska saboot nahi ki ek approach asli scale par kaam karta rahega.',
      'Ek scaling samasya ka fix aksar underlying data structure ko khud reorganize karna hai, micro-optimization ke zariye usi operation ko "tez" banaana nahi.',
      'Ye course taulanaatmak roop se kam genuinely reusable patterns sikhaata hai, prati module ek, akele problems ke yaad kiye gaye solutions ke bajaye, kyunki patterns naye problems tak transfer hote hain aur yaad kiye gaye solutions nahi.',
      'Kuch ship karne se pehle "ye data badhne ke saath kaise scale karta hai?" poochhna wo akela professional aadat hai jise ye poora course banaane ke liye maujood hai.',
    ],
  },
];
