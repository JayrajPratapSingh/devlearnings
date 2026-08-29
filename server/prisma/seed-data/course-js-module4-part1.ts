/**
 * JavaScript Complete Course — Module 4: The Browser and the Network (1 of 2).
 *
 * The DOM, events and fetch. This is the module that turns "I know the language"
 * into "I can build a page that does something" — and it is the one most
 * language-focused courses skip entirely.
 *
 * Same writing rules as Module 1:
 *   1. Open with something from real life, not from programming.
 *   2. One idea per entry. If it needs two, it needs two lessons.
 *   3. No word the reader has not met yet, unless you define it in the sentence.
 *   4. Every example shows its output. Never make the reader guess.
 */

import type { CourseLesson } from './course-js-module1';

export const JS_MODULE_4_PART1: CourseLesson[] = [
  /* ══════════════════════ DOM Manipulation ══════════════════════ */
  {
    slug: 'dom-manipulation',
    title: 'The DOM — Changing the Page',
    titleHi: 'DOM — Page Ko Badalna',
    description: 'The page as a live tree of boxes you can open, relabel and rearrange.',
    descriptionHi: 'Page ek zinda ped hai dabbon ka — jise aap khol sakte ho, naam badal sakte ho, hila sakte ho.',
    difficulty: 'MEDIUM',
    duration: 35,
    order: 1,

    analogy: {
      en: '**A shop window you can rearrange while people watch.** The HTML file is the plan you handed the window dresser this morning. The DOM is the actual window right now — and JavaScript is you, standing inside it, moving things around while customers are looking. Every change is visible instantly.',
      hi: '**Aisa shop window jise aap logon ke saamne hi badal sakte ho.** HTML file wo plan hai jo aapne subah window dresser ko diya tha. DOM abhi ka asli window hai — aur JavaScript aap ho, uske andar khade hokar, grahakon ke dekhte-dekhte cheezein hila rahe ho. Har badlav turant dikhta hai.',
    },

    simple: `**The DOM is your page, as a live object.**

You wrote HTML. The browser read it and built a tree of objects from it. That tree is the **DOM**, and changing it changes what people see — immediately.

\`\`\`html
<div id="app">
  <h1 class="title">Hello</h1>
  <button>Click me</button>
</div>
\`\`\`

The browser turned that into a tree: \`div\` has two children, \`h1\` and \`button\`.

**Step 1 — find the element**

\`\`\`js
document.querySelector('#app');       // first match, by CSS selector
document.querySelector('.title');     // the h1
document.querySelectorAll('button');  // ALL matches
\`\`\`

If you know CSS, you already know how to find elements. Same selectors.

**Step 2 — change it**

\`\`\`js
const title = document.querySelector('.title');

title.textContent = 'Goodbye';        // change the text
title.classList.add('highlighted');   // add a class
title.style.color = 'red';            // change one style
\`\`\`

That is genuinely most of DOM work: find it, then change its text, its classes, or its attributes.

**textContent versus innerHTML**

\`\`\`js
el.textContent = '<b>hi</b>';   // shows the literal text: <b>hi</b>
el.innerHTML   = '<b>hi</b>';   // renders BOLD hi
\`\`\`

\`innerHTML\` treats your string as HTML and runs it. **If that string came from a user, you just let them run code on your page.** Use \`textContent\` unless you genuinely need to insert markup, and never with user input.

**Step 3 — create and add**

\`\`\`js
const li = document.createElement('li');
li.textContent = 'New item';
document.querySelector('ul').append(li);
\`\`\`

Create it, fill it, attach it. Until you append it, it exists but nobody can see it.

**Remember:** find with a CSS selector, change with \`textContent\` and \`classList\`, and never put user text into \`innerHTML\`.`,

    simpleHi: `**DOM aapka page hai, ek zinda object ke roop mein.**

Aapne HTML likhi. Browser ne usse padhkar objects ka ek ped bana diya. Wahi ped **DOM** hai, aur usse badalne par logon ko dikhne wala page turant badal jata hai.

\`\`\`html
<div id="app">
  <h1 class="title">Hello</h1>
  <button>Click me</button>
</div>
\`\`\`

Browser ne isse ped bana diya: \`div\` ke do bacche hain, \`h1\` aur \`button\`.

**Step 1 — element dhoondho**

\`\`\`js
document.querySelector('#app');       // pehla match, CSS selector se
document.querySelector('.title');     // h1
document.querySelectorAll('button');  // SAARE matches
\`\`\`

Agar CSS aati hai, to elements dhoondhna aapko pehle se aata hai. Wahi selectors.

**Step 2 — usse badlo**

\`\`\`js
const title = document.querySelector('.title');

title.textContent = 'Goodbye';        // text badlo
title.classList.add('highlighted');   // class jodo
title.style.color = 'red';            // ek style badlo
\`\`\`

Sach mein DOM ka zyadatar kaam yahi hai: dhoondho, phir uska text, classes, ya attributes badlo.

**textContent versus innerHTML**

\`\`\`js
el.textContent = '<b>hi</b>';   // literal text dikhta hai: <b>hi</b>
el.innerHTML   = '<b>hi</b>';   // BOLD hi render hota hai
\`\`\`

\`innerHTML\` aapki string ko HTML maankar chalata hai. **Agar wo string user se aayi hai, to aapne unhe apne page par code chalane de diya.** \`textContent\` use karo jab tak sach mein markup daalna zaroori na ho, aur user input ke saath to kabhi nahi.

**Step 3 — banao aur jodo**

\`\`\`js
const li = document.createElement('li');
li.textContent = 'New item';
document.querySelector('ul').append(li);
\`\`\`

Banao, bharo, jodo. Jab tak append nahi karoge, wo exist to karta hai par kisi ko dikhta nahi.

**Yaad rakho:** CSS selector se dhoondho, \`textContent\` aur \`classList\` se badlo, aur user ka text \`innerHTML\` mein kabhi mat daalo.`,

    content: `## Finding elements

\`\`\`js
document.querySelector('.card')       // first match — use this
document.querySelectorAll('.card')    // all matches, a static NodeList
document.getElementById('app')        // marginally faster, id only
element.closest('.container')         // walk UP to the nearest ancestor match
element.querySelector('.child')       // search only inside this element
\`\`\`

\`querySelectorAll\` returns a **NodeList**, not an array. It has \`forEach\` but not \`map\` or \`filter\` — spread it first: \`[...document.querySelectorAll('li')]\`.

## Changing content

| Property | What it does | Safe with user input? |
|---|---|---|
| \`textContent\` | plain text, escapes everything | ✅ yes |
| \`innerText\` | like textContent but respects CSS visibility, slower | ✅ yes |
| \`innerHTML\` | parses the string as HTML | ❌ **never** |

## Classes and styles

\`\`\`js
el.classList.add('active');
el.classList.remove('hidden');
el.classList.toggle('open');          // add if absent, remove if present
el.classList.toggle('open', isOpen);  // force it to a boolean
el.classList.contains('active');      // → true / false
\`\`\`

Prefer toggling a class over setting \`.style\` directly — it keeps the look in the stylesheet where a designer can find it.

## Attributes versus properties

\`\`\`js
el.getAttribute('href')   // what the HTML literally says: "/about"
el.href                   // the resolved property: "https://site.com/about"
el.dataset.userId         // reads data-user-id="7"
\`\`\`

For inputs the distinction matters: \`value\` is the current typed value, while \`getAttribute('value')\` is only the original default.

## Creating and moving

\`\`\`js
const el = document.createElement('li');
parent.append(el);          // add at the end
parent.prepend(el);         // add at the start
el.remove();                // delete it
existing.before(el);        // insert as a sibling
\`\`\`

Appending an element that is already in the page **moves** it rather than copying it.

## Batch your writes

Every read of a layout property (\`offsetHeight\`, \`getBoundingClientRect\`) forces the browser to recalculate layout. Interleaving reads and writes in a loop causes "layout thrashing":

\`\`\`js
// ❌ forces layout on every iteration
items.forEach(el => { el.style.height = el.offsetHeight + 10 + 'px'; });

// ✅ read everything, then write everything
const heights = items.map(el => el.offsetHeight);
items.forEach((el, i) => { el.style.height = heights[i] + 10 + 'px'; });
\`\`\`

For building many elements at once, use a \`DocumentFragment\` so the page is touched only once.`,

    contentHi: `## Elements dhoondhna

\`\`\`js
document.querySelector('.card')       // pehla match — yahi use karo
document.querySelectorAll('.card')    // saare matches, static NodeList
document.getElementById('app')        // thoda tez, sirf id ke liye
element.closest('.container')         // UPAR chalkar sabse paas ka ancestor
element.querySelector('.child')       // sirf is element ke andar dhoondho
\`\`\`

\`querySelectorAll\` **NodeList** deta hai, array nahi. Usme \`forEach\` hai par \`map\` ya \`filter\` nahi — pehle spread karo: \`[...document.querySelectorAll('li')]\`.

## Content badalna

| Property | Kya karti hai | User input ke saath safe? |
|---|---|---|
| \`textContent\` | plain text, sab escape karta hai | ✅ haan |
| \`innerText\` | textContent jaisa par CSS visibility maanta hai, slow | ✅ haan |
| \`innerHTML\` | string ko HTML maankar parse karta hai | ❌ **kabhi nahi** |

## Classes aur styles

\`\`\`js
el.classList.add('active');
el.classList.remove('hidden');
el.classList.toggle('open');          // na ho to jodo, ho to hatao
el.classList.toggle('open', isOpen);  // boolean se zabardasti set karo
el.classList.contains('active');      // → true / false
\`\`\`

Seedhe \`.style\` set karne ke bajaye class toggle karna behtar hai — isse look stylesheet mein rehta hai jahan designer usse dhoondh sake.

## Attributes versus properties

\`\`\`js
el.getAttribute('href')   // HTML mein jo likha hai: "/about"
el.href                   // resolved property: "https://site.com/about"
el.dataset.userId         // data-user-id="7" padhta hai
\`\`\`

Inputs ke liye ye fark zaroori hai: \`value\` abhi type ki gayi value hai, jabki \`getAttribute('value')\` sirf shuruaati default hai.

## Banana aur hilana

\`\`\`js
const el = document.createElement('li');
parent.append(el);          // ant mein jodo
parent.prepend(el);         // shuru mein jodo
el.remove();                // hata do
existing.before(el);        // sibling ki tarah daalo
\`\`\`

Jo element page mein pehle se hai usse append karne par wo copy nahi hota, **hil jata hai**.

## Writes ko ek saath karo

Layout property (\`offsetHeight\`, \`getBoundingClientRect\`) ka har read browser ko layout dobara calculate karne par majboor karta hai. Loop mein reads aur writes milane se "layout thrashing" hota hai:

\`\`\`js
// ❌ har iteration mein layout force hota hai
items.forEach(el => { el.style.height = el.offsetHeight + 10 + 'px'; });

// ✅ pehle sab padho, phir sab likho
const heights = items.map(el => el.offsetHeight);
items.forEach((el, i) => { el.style.height = heights[i] + 10 + 'px'; });
\`\`\`

Bahut saare elements ek saath banane ho to \`DocumentFragment\` use karo taaki page ko sirf ek baar chhua jaye.`,

    examples: [
      {
        title: 'Finding elements with CSS selectors',
        titleHi: 'CSS selectors se elements dhoondhna',
        code: `// <div id="app"><h1 class="title">Hello</h1><button>Go</button></div>

const app = document.querySelector('#app');
const title = document.querySelector('.title');
const buttons = document.querySelectorAll('button');

console.log(title.textContent);
console.log(buttons.length);
console.log(app.querySelector('h1') === title);`,
        output: `Hello
1
true`,
        explain: 'Any CSS selector works. Note the last line: calling `querySelector` on an element searches only inside it, which keeps components from reaching into each other.',
        explainHi: 'Koi bhi CSS selector chalta hai. Aakhri line dhyan se dekho: kisi element par `querySelector` bulane par khoj sirf uske andar hoti hai, jisse components ek doosre mein haath nahi daalte.',
      },
      {
        title: 'querySelectorAll is not an array',
        titleHi: 'querySelectorAll array nahi hai',
        code: `const items = document.querySelectorAll('li');

console.log(Array.isArray(items));
console.log(items.constructor.name);

items.forEach(i => {});          // works

try {
  items.map(i => i.textContent);
} catch (e) {
  console.log('Error:', e.message);
}

console.log([...items].map(i => i.textContent));`,
        output: `false
NodeList
Error: items.map is not a function
[ 'One', 'Two' ]`,
        explain: 'A NodeList has `forEach` but nothing else from Array. Spread it the moment you need `map`, `filter` or `reduce`.',
        explainHi: 'NodeList mein `forEach` hai par Array ka baaki kuch nahi. `map`, `filter` ya `reduce` chahiye hote hi usse spread kar lo.',
      },
      {
        title: 'textContent versus innerHTML',
        titleHi: 'textContent versus innerHTML',
        code: `const el = document.querySelector('#out');

el.textContent = '<b>bold?</b>';
console.log('textContent shows:', el.textContent);
console.log('children:', el.children.length);

el.innerHTML = '<b>bold?</b>';
console.log('innerHTML children:', el.children.length);
console.log('tag created:', el.children[0].tagName);`,
        output: `textContent shows: <b>bold?</b>
children: 0
innerHTML children: 1
tag created: B`,
        explain: '`textContent` created zero elements — it showed the tags as literal characters. `innerHTML` actually built a `<b>` element. That difference is exactly the XSS boundary.',
        explainHi: '`textContent` ne zero elements banaye — usne tags ko literal characters dikhaya. `innerHTML` ne sach mein `<b>` element bana diya. Yahi fark XSS ki seema hai.',
      },
      {
        title: 'The XSS hole in one line',
        titleHi: 'Ek line mein XSS ka chhed',
        code: `const userInput = '<img src=x onerror="alert(document.cookie)">';

// ❌ the image fails to load, onerror fires, attacker runs code
document.querySelector('#unsafe').innerHTML = userInput;

// ✅ shown as harmless text
document.querySelector('#safe').textContent = userInput;

console.log('unsafe created', document.querySelector('#unsafe').children.length, 'element(s)');
console.log('safe created', document.querySelector('#safe').children.length, 'element(s)');`,
        output: `unsafe created 1 element(s)
safe created 0 element(s)`,
        explain: 'The attacker never needed a `<script>` tag. A broken image with an `onerror` handler is enough. `textContent` created nothing, so there was nothing to run.',
        explainHi: 'Hamlavar ko `<script>` tag ki zarurat hi nahi padi. `onerror` handler wali ek tooti hui image kaafi hai. `textContent` ne kuch banaya hi nahi, isliye chalane ko kuch tha hi nahi.',
      },
      {
        title: 'classList — the everyday tool',
        titleHi: 'classList — rozmarra ka auzaar',
        code: `const el = document.querySelector('.box');

el.classList.add('active');
console.log(el.className);

el.classList.toggle('open');
console.log(el.className);

el.classList.toggle('open');
console.log(el.className);

el.classList.toggle('open', true);
console.log(el.classList.contains('open'));`,
        output: `box active
box active open
box active
true`,
        explain: 'The two-argument `toggle(name, force)` is the underused one — pass a boolean and you never have to write `if (x) add() else remove()` again.',
        explainHi: 'Do-argument wala `toggle(name, force)` kam use hota hai — ek boolean do aur `if (x) add() else remove()` dobara likhne ki zarurat hi nahi padegi.',
      },
      {
        title: 'Creating and appending',
        titleHi: 'Banana aur append karna',
        code: `const list = document.querySelector('ul');

const li = document.createElement('li');
li.textContent = 'New item';
li.classList.add('item');

console.log('before append, in page?', document.body.contains(li));
list.append(li);
console.log('after append, in page?', document.body.contains(li));
console.log('list now has', list.children.length, 'items');`,
        output: `before append, in page? false
after append, in page? true
list now has 1 items`,
        explain: 'A created element exists in memory but is invisible until you attach it. That is useful — you can build and configure it fully before the user ever sees it.',
        explainHi: 'Banaya gaya element memory mein hota hai par jodne tak dikhta nahi. Ye kaam ka hai — user ke dekhne se pehle aap usse poori tarah bana aur set kar sakte ho.',
      },
      {
        title: 'Rendering a list from data',
        titleHi: 'Data se list banana',
        code: `const users = [
  { id: 1, name: 'Jay' },
  { id: 2, name: 'Ravi' },
];

const ul = document.querySelector('#users');
const frag = document.createDocumentFragment();

for (const user of users) {
  const li = document.createElement('li');
  li.textContent = user.name;
  li.dataset.id = user.id;
  frag.append(li);
}

ul.append(frag);
console.log(ul.children.length);
console.log(ul.children[0].dataset.id);`,
        output: `2
1`,
        explain: 'The fragment collects everything off-screen, so the page is touched once instead of twice. With 500 rows that is the difference between smooth and visibly janky.',
        explainHi: 'Fragment sab kuch screen ke bahar jama karta hai, isliye page do baar ke bajaye ek baar chhua jata hai. 500 rows par ye smooth aur saaf dikhne wale jhatke ka fark hai.',
      },
      {
        title: 'Attributes versus properties',
        titleHi: 'Attributes versus properties',
        code: `// <input id="name" value="default">
const input = document.querySelector('#name');

console.log('property:', input.value);
console.log('attribute:', input.getAttribute('value'));

input.value = 'user typed this';

console.log('property now:', input.value);
console.log('attribute now:', input.getAttribute('value'));`,
        output: `property: default
attribute: default
property now: user typed this
attribute now: default`,
        explain: 'The attribute is the original HTML and never changes. The property is the live value. Reading `getAttribute("value")` to find out what someone typed is a classic bug.',
        explainHi: 'Attribute original HTML hai aur kabhi nahi badalta. Property live value hai. Kisi ne kya type kiya ye jaanne ke liye `getAttribute("value")` padhna classic bug hai.',
      },
      {
        title: 'Layout thrashing',
        titleHi: 'Layout thrashing',
        code: `const boxes = [...document.querySelectorAll('.box')];

// ❌ read, write, read, write — forces layout every loop
console.time('thrash');
boxes.forEach(b => { b.style.width = b.offsetWidth + 1 + 'px'; });
console.timeEnd('thrash');

// ✅ read all, then write all
console.time('batched');
const widths = boxes.map(b => b.offsetWidth);
boxes.forEach((b, i) => { b.style.width = widths[i] + 1 + 'px'; });
console.timeEnd('batched');`,
        output: `thrash: 18.4ms
batched: 1.2ms`,
        explain: 'Writing then reading forces the browser to recompute layout immediately, every iteration. Separating the phases lets it batch the work — the single most effective DOM performance fix.',
        explainHi: 'Likhkar phir padhne se browser ko har iteration mein turant layout dobara nikalna padta hai. Dono phase alag karne se wo kaam ek saath kar leta hai — DOM performance ka sabse asardar fix yahi hai.',
      },
    ],

    mistakes: [
      {
        wrong: `el.innerHTML = userComment;  // ❌ XSS`,
        right: `el.textContent = userComment;  // ✅`,
        why: '`innerHTML` parses and executes markup. Any user-controlled string becomes runnable code on your page.',
        whyHi: '`innerHTML` markup parse karke chalata hai. User ki control wali koi bhi string aapke page par chalne wala code ban jati hai.',
      },
      {
        wrong: `const el = document.querySelector('#app');\n// ❌ null if the script runs before the element exists`,
        right: `// put the script at the end of <body>, or:\ndocument.addEventListener('DOMContentLoaded', () => { … });`,
        why: 'A script in `<head>` runs before the body is parsed, so the element is not there yet and `querySelector` returns null.',
        whyHi: '`<head>` ka script body parse hone se pehle chalta hai, isliye element hota hi nahi aur `querySelector` null deta hai.',
      },
      {
        wrong: `document.querySelectorAll('li').map(…)  // ❌ not a function`,
        right: `[...document.querySelectorAll('li')].map(…)  // ✅`,
        why: 'A NodeList only implements `forEach`. Spread it into a real array for every other method.',
        whyHi: 'NodeList mein sirf `forEach` hota hai. Baaki har method ke liye usse asli array mein spread karo.',
      },
      {
        wrong: `for (const u of users) ul.innerHTML += \`<li>\${u.name}</li>\`;  // ❌`,
        right: `const frag = document.createDocumentFragment();\n// build into frag, then ul.append(frag);  // ✅`,
        why: '`innerHTML +=` re-parses the entire list on every iteration and destroys any existing event listeners on those children.',
        whyHi: '`innerHTML +=` har iteration mein poori list dobara parse karta hai aur un children par lage saare event listeners mita deta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Every interactive page.** Showing a modal, marking a todo done, filtering a list — all of it is find, then change a class or some text.',
        hi: '**Har interactive page.** Modal dikhana, todo ko done karna, list filter karna — sab kuch dhoondho aur phir class ya text badlo, bas.',
      },
      {
        en: '**What frameworks hide.** React\'s virtual DOM exists to batch exactly these operations for you. Knowing what it is batching is what lets you debug it when it misbehaves.',
        hi: '**Frameworks jo chhupate hain.** React ka virtual DOM inhi operations ko aapke liye ek saath karne ke liye hai. Wo kya batch kar raha hai ye pata ho to hi galat hone par debug kar paoge.',
      },
      {
        en: '**Third-party widgets.** Analytics snippets, chat bubbles and cookie banners are all plain DOM scripts injected into a page they did not build.',
        hi: '**Third-party widgets.** Analytics snippets, chat bubbles aur cookie banners sab simple DOM scripts hain jo aise page mein daale jate hain jo unhone banaya hi nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between `textContent`, `innerText` and `innerHTML`?',
        qHi: '`textContent`, `innerText` aur `innerHTML` mein kya fark hai?',
        a: '`textContent` gets or sets raw text and escapes any markup. `innerText` is similar but respects CSS visibility and triggers a reflow, so it is slower. `innerHTML` parses the string as HTML and creates real elements — which makes it an XSS risk with any untrusted input.',
        aHi: '`textContent` raw text deta/leta hai aur markup escape kar deta hai. `innerText` waisa hi hai par CSS visibility maanta hai aur reflow karata hai, isliye slow hai. `innerHTML` string ko HTML maankar parse karta hai aur asli elements banata hai — jisse kisi bhi bharose ke laayak na input ke saath ye XSS ka khatra ban jata hai.',
      },
      {
        q: 'Why can `querySelectorAll(...).map()` fail?',
        qHi: '`querySelectorAll(...).map()` fail kyun ho sakta hai?',
        a: 'It returns a NodeList, not an Array. NodeList implements `forEach` and is iterable, but has none of the other array methods. Convert it with spread or `Array.from` first.',
        aHi: 'Wo NodeList deta hai, Array nahi. NodeList mein `forEach` hai aur wo iterable hai, par baaki koi array method nahi. Pehle spread ya `Array.from` se convert karo.',
      },
      {
        q: 'What is the difference between an attribute and a property?',
        qHi: 'Attribute aur property mein kya fark hai?',
        a: 'Attributes are what the HTML source declares and are always strings. Properties live on the DOM object and can be any type. For inputs they diverge as soon as the user types: `input.value` is the current value while `getAttribute("value")` still returns the original default.',
        aHi: 'Attributes wo hain jo HTML source mein likhe hain aur hamesha strings hote hain. Properties DOM object par rehti hain aur kisi bhi type ki ho sakti hain. Inputs mein user ke type karte hi ye alag ho jate hain: `input.value` current value hai jabki `getAttribute("value")` abhi bhi original default deta hai.',
      },
      {
        q: 'What is layout thrashing and how do you avoid it?',
        qHi: 'Layout thrashing kya hai aur usse kaise bachte hain?',
        a: 'Alternating DOM writes and layout reads inside a loop. Each read after a write forces a synchronous reflow, so N iterations cause N reflows. Avoid it by batching: read every measurement first, then apply every write.',
        aHi: 'Loop ke andar DOM writes aur layout reads ko badal-badal kar karna. Har write ke baad ka read synchronous reflow karata hai, isliye N iterations mein N reflows hote hain. Batch karke bacho: pehle saare measurements padho, phir saare writes lagao.',
        code: `// read phase
const widths = els.map(e => e.offsetWidth);
// write phase
els.forEach((e, i) => { e.style.width = widths[i] + 'px'; });`,
      },
      {
        q: 'Why might `document.querySelector` return null?',
        qHi: '`document.querySelector` null kyun de sakta hai?',
        a: 'Either the selector matches nothing, or the script ran before the browser parsed that part of the document. Scripts in `<head>` without `defer` execute before the body exists. Fix it with `defer`, by placing the script at the end of `<body>`, or by waiting for `DOMContentLoaded`.',
        aHi: 'Ya to selector se kuch match nahi hua, ya script tab chali jab browser ne document ka wo hissa parse hi nahi kiya tha. `<head>` ke bina-`defer` scripts body banne se pehle chalte hain. Fix: `defer` lagao, script `<body>` ke ant mein rakho, ya `DOMContentLoaded` ka intezaar karo.',
      },
    ],

    exercises: [
      {
        task: 'Build a page with a button and a paragraph. Clicking the button should toggle a `hidden` class on the paragraph. Use `classList.toggle`, not `style.display`.',
        taskHi: 'Ek page banao jisme button aur paragraph ho. Button click karne par paragraph par `hidden` class toggle ho. `style.display` nahi, `classList.toggle` use karo.',
        hint: 'Define `.hidden { display: none }` in CSS. Keeping the look in the stylesheet is the whole point of using a class.',
        hintHi: 'CSS mein `.hidden { display: none }` define karo. Look ko stylesheet mein rakhna hi class use karne ka poora maqsad hai.',
      },
      {
        task: 'Given an array of 200 objects, render them as list items using a DocumentFragment. Then rewrite it with `innerHTML +=` in a loop and compare the timings.',
        taskHi: '200 objects ki array ko DocumentFragment se list items banakar render karo. Phir loop mein `innerHTML +=` se dobara likho aur timings compare karo.',
        hint: 'Use `console.time`. The fragment version touches the live DOM once; the `innerHTML` version re-parses the whole list 200 times.',
        hintHi: '`console.time` use karo. Fragment wala version live DOM ko ek baar chhuta hai; `innerHTML` wala poori list 200 baar dobara parse karta hai.',
      },
      {
        task: 'Write `renderComment(text)` that safely displays user text containing `<script>alert(1)</script>`. Prove with `children.length` that no element was created.',
        taskHi: '`renderComment(text)` likho jo `<script>alert(1)</script>` wale user text ko safely dikhaye. `children.length` se sabit karo ki koi element nahi bana.',
        hint: '`textContent` is the entire fix. Then try it with `innerHTML` to see the difference for yourself.',
        hintHi: '`textContent` hi poora ilaaj hai. Phir `innerHTML` se try karke fark khud dekho.',
      },
    ],

    keyTakeaways: [
      'The DOM is a live object tree of your page — changing it changes the screen immediately.',
      'Find elements with CSS selectors: `querySelector` for one, `querySelectorAll` for many.',
      '`querySelectorAll` returns a NodeList — spread it to use `map` or `filter`.',
      '`textContent` is safe; `innerHTML` executes markup and is an XSS hole with user input.',
      'Toggle classes rather than setting `.style`, so the look stays in the stylesheet.',
      'Batch reads and writes separately, and use a DocumentFragment when adding many nodes.',
    ],
    keyTakeawaysHi: [
      'DOM aapke page ka zinda object ped hai — usse badlo aur screen turant badal jati hai.',
      'CSS selectors se elements dhoondho: ek ke liye `querySelector`, kai ke liye `querySelectorAll`.',
      '`querySelectorAll` NodeList deta hai — `map` ya `filter` ke liye usse spread karo.',
      '`textContent` safe hai; `innerHTML` markup chalata hai aur user input ke saath XSS ka chhed hai.',
      '`.style` set karne ke bajaye classes toggle karo, taaki look stylesheet mein rahe.',
      'Reads aur writes alag-alag batch karo, aur bahut nodes jodne ho to DocumentFragment use karo.',
    ],
  },

  /* ══════════════════════ Events ══════════════════════ */
  {
    slug: 'events-and-delegation',
    title: 'Events and Delegation',
    titleHi: 'Events aur Delegation',
    description: 'Ripples spreading outward — and why one listener can handle a thousand buttons.',
    descriptionHi: 'Bahar ki taraf failti lehrein — aur ek listener hazaar buttons kaise sambhal leta hai.',
    difficulty: 'MEDIUM',
    duration: 35,
    order: 2,

    analogy: {
      en: '**A stone dropped in a pond.** The click lands on the button, but the ripple spreads outward — to the card, to the section, to the body, all the way to the document. Anyone standing at any of those rings feels it. That is why one guard at the building entrance can notice every door that opens inside.',
      hi: '**Talab mein gira patthar.** Click button par padta hai, par lehar bahar ki taraf failti hai — card tak, section tak, body tak, document tak. Un mein se kisi bhi ghere par khada koi bhi usse mehsoos karta hai. Isiliye building ke gate par khada ek guard andar khulne wala har darwaza dekh leta hai.',
    },

    simple: `**Listening for something to happen**

\`\`\`js
button.addEventListener('click', (event) => {
  console.log('clicked!');
});
\`\`\`

Three parts: **what** to listen to (\`'click'\`), **what to do**, and the \`event\` object describing what happened.

**The event object**

\`\`\`js
el.addEventListener('click', (e) => {
  e.target;           // the exact element that was clicked
  e.currentTarget;    // the element the listener is attached to
  e.preventDefault(); // stop the browser's default behaviour
});
\`\`\`

\`target\` and \`currentTarget\` are different, and the difference is the key to this whole lesson.

**Bubbling — the ripple**

Click a button inside a card inside the body. The event fires on the button, then the card, then the body, then \`document\`. It **bubbles upward** through every ancestor.

This is not a quirk. It is the most useful thing about events.

**Delegation — one listener instead of a thousand**

Say you have a list of 500 items, each with a delete button. The naive approach:

\`\`\`js
// ❌ 500 listeners, and new items get none
document.querySelectorAll('.delete').forEach(btn => {
  btn.addEventListener('click', handleDelete);
});
\`\`\`

Two problems: 500 listeners costs memory, and any item added later has no listener at all.

The fix — put **one** listener on the parent and ask what was clicked:

\`\`\`js
// ✅ one listener, works for items added later too
list.addEventListener('click', (e) => {
  const btn = e.target.closest('.delete');
  if (!btn) return;          // clicked something else — ignore
  handleDelete(btn);
});
\`\`\`

That is **event delegation**. One listener on the parent, \`closest()\` to find what you care about. It handles items that do not exist yet, because the listener is not on them — it is on their parent.

**Stopping things**

\`\`\`js
e.preventDefault();    // stop the default (form submit, link navigation)
e.stopPropagation();   // stop the ripple going further up
\`\`\`

They are different. \`preventDefault\` stops the *browser*; \`stopPropagation\` stops the *event travelling*.

**Remember:** events bubble upward. One listener on a parent beats a thousand on children.`,

    simpleHi: `**Kuch hone ka intezaar karna**

\`\`\`js
button.addEventListener('click', (event) => {
  console.log('click hua!');
});
\`\`\`

Teen hisse: **kya** sunna hai (\`'click'\`), **kya karna hai**, aur \`event\` object jo batata hai kya hua.

**Event object**

\`\`\`js
el.addEventListener('click', (e) => {
  e.target;           // bilkul wahi element jispar click hua
  e.currentTarget;    // wo element jispar listener laga hai
  e.preventDefault(); // browser ka default behaviour roko
});
\`\`\`

\`target\` aur \`currentTarget\` alag hain, aur yahi fark poore sabak ki chaabi hai.

**Bubbling — lehar**

Body ke andar card, card ke andar button — uspar click karo. Event pehle button par chalta hai, phir card par, phir body par, phir \`document\` par. Wo har ancestor se hokar **upar bubble** karta hai.

Ye koi kharabi nahi hai. Events ki sabse kaam ki baat yahi hai.

**Delegation — hazaar ki jagah ek listener**

Maan lo 500 items ki list hai, har ek par delete button. Seedha tarika:

\`\`\`js
// ❌ 500 listeners, aur naye items ko ek bhi nahi
document.querySelectorAll('.delete').forEach(btn => {
  btn.addEventListener('click', handleDelete);
});
\`\`\`

Do samasyaein: 500 listeners memory lete hain, aur baad mein juda koi bhi item bina listener ke rehta hai.

Ilaaj — parent par **ek** listener lagao aur pucho kispar click hua:

\`\`\`js
// ✅ ek listener, baad mein jude items par bhi chalta hai
list.addEventListener('click', (e) => {
  const btn = e.target.closest('.delete');
  if (!btn) return;          // kuch aur click hua — chhod do
  handleDelete(btn);
});
\`\`\`

Isi ko **event delegation** kehte hain. Parent par ek listener, aur jo chahiye usse dhoondhne ke liye \`closest()\`. Ye un items par bhi chalta hai jo abhi bane hi nahi, kyunki listener unpar hai hi nahi — unke parent par hai.

**Rokna**

\`\`\`js
e.preventDefault();    // default roko (form submit, link navigation)
e.stopPropagation();   // lehar ko aur upar jaane se roko
\`\`\`

Dono alag hain. \`preventDefault\` *browser* ko rokta hai; \`stopPropagation\` *event ke safar* ko.

**Yaad rakho:** events upar bubble karte hain. Parent par ek listener children par hazaar se behtar hai.`,

    content: `## The three phases

An event travels in three phases:

1. **Capture** — from \`document\` down to the target
2. **Target** — on the element itself
3. **Bubble** — back up from the target to \`document\`

\`addEventListener\` listens in the bubble phase by default. Pass \`{ capture: true }\` for the way down. You will use capture roughly once a year.

## target versus currentTarget

\`\`\`js
list.addEventListener('click', (e) => {
  e.target;         // the deepest element clicked — maybe an <img> inside a button
  e.currentTarget;  // always \`list\`, where the listener lives
});
\`\`\`

Because \`target\` can be a child of the thing you care about, delegation uses \`closest()\`:

\`\`\`js
const btn = e.target.closest('.delete');
\`\`\`

Checking \`e.target.matches('.delete')\` breaks the moment someone puts an icon inside the button.

## Useful options

\`\`\`js
el.addEventListener('click', fn, { once: true });     // auto-removes after firing
el.addEventListener('scroll', fn, { passive: true }); // promises no preventDefault → smoother scroll
el.addEventListener('click', fn, { signal });         // remove via an AbortController
\`\`\`

The \`signal\` option is the modern way to clean up many listeners at once:

\`\`\`js
const ac = new AbortController();
el.addEventListener('click', a, { signal: ac.signal });
el.addEventListener('keyup', b, { signal: ac.signal });
ac.abort();   // both removed
\`\`\`

## Removing listeners

\`removeEventListener\` needs the **same function reference**:

\`\`\`js
el.addEventListener('click', () => {});
el.removeEventListener('click', () => {});   // ❌ different function, removes nothing
\`\`\`

Keep a named reference, or use \`{ once: true }\` or an AbortController.

## Events that do not bubble

\`focus\`, \`blur\`, \`load\`, \`error\` and \`mouseenter\` do not bubble. For delegation use their bubbling twins: \`focusin\`, \`focusout\`, \`mouseover\`.

## Custom events

\`\`\`js
el.dispatchEvent(new CustomEvent('cart:updated', {
  detail: { total: 500 },
  bubbles: true,
}));

document.addEventListener('cart:updated', (e) => console.log(e.detail.total));
\`\`\`

This lets separate parts of a page talk without importing each other.`,

    contentHi: `## Teen phase

Event teen phase mein safar karta hai:

1. **Capture** — \`document\` se neeche target tak
2. **Target** — khud element par
3. **Bubble** — target se wapas upar \`document\` tak

\`addEventListener\` default mein bubble phase sunta hai. Neeche wale raste ke liye \`{ capture: true }\` do. Capture aap saal mein shayad ek baar use karoge.

## target versus currentTarget

\`\`\`js
list.addEventListener('click', (e) => {
  e.target;         // sabse andar wala clicked element — button ke andar ka <img> bhi ho sakta hai
  e.currentTarget;  // hamesha \`list\`, jahan listener laga hai
});
\`\`\`

Chunki \`target\` us cheez ka bachcha ho sakta hai jo aapko chahiye, delegation \`closest()\` use karta hai:

\`\`\`js
const btn = e.target.closest('.delete');
\`\`\`

\`e.target.matches('.delete')\` check karna tabhi toot jata hai jab koi button ke andar icon daal deta hai.

## Kaam ke options

\`\`\`js
el.addEventListener('click', fn, { once: true });     // chalne ke baad khud hat jata hai
el.addEventListener('scroll', fn, { passive: true }); // waada ki preventDefault nahi karega → smooth scroll
el.addEventListener('click', fn, { signal });         // AbortController se hatao
\`\`\`

\`signal\` option kai listeners ek saath saaf karne ka modern tarika hai:

\`\`\`js
const ac = new AbortController();
el.addEventListener('click', a, { signal: ac.signal });
el.addEventListener('keyup', b, { signal: ac.signal });
ac.abort();   // dono hat gaye
\`\`\`

## Listeners hataana

\`removeEventListener\` ko **wahi function reference** chahiye:

\`\`\`js
el.addEventListener('click', () => {});
el.removeEventListener('click', () => {});   // ❌ alag function, kuch nahi hataega
\`\`\`

Named reference rakho, ya \`{ once: true }\` ya AbortController use karo.

## Jo events bubble nahi karte

\`focus\`, \`blur\`, \`load\`, \`error\` aur \`mouseenter\` bubble nahi karte. Delegation ke liye unke bubble karne wale jodidar use karo: \`focusin\`, \`focusout\`, \`mouseover\`.

## Custom events

\`\`\`js
el.dispatchEvent(new CustomEvent('cart:updated', {
  detail: { total: 500 },
  bubbles: true,
}));

document.addEventListener('cart:updated', (e) => console.log(e.detail.total));
\`\`\`

Isse page ke alag-alag hisse bina ek doosre ko import kiye baat kar lete hain.`,

    examples: [
      {
        title: 'Your first listener',
        titleHi: 'Aapka pehla listener',
        code: `const btn = document.querySelector('button');

btn.addEventListener('click', (e) => {
  console.log('type:', e.type);
  console.log('tag:', e.target.tagName);
});

btn.click();   // trigger it programmatically`,
        output: `type: click
tag: BUTTON`,
        explain: 'The handler receives an event object describing what happened. `btn.click()` fires it from code, which is exactly how you test handlers.',
        explainHi: 'Handler ko event object milta hai jo batata hai kya hua. `btn.click()` usse code se chalata hai, aur handlers isi tarah test kiye jate hain.',
      },
      {
        title: 'Watching an event bubble',
        titleHi: 'Event ko bubble karte dekhna',
        code: `// <div id="outer"><div id="inner"><button>Go</button></div></div>

['outer', 'inner'].forEach(id => {
  document.getElementById(id)
    .addEventListener('click', () => console.log('reached', id));
});

document.querySelector('button')
  .addEventListener('click', () => console.log('reached button'));

document.querySelector('button').click();`,
        output: `reached button
reached inner
reached outer`,
        explain: 'One click, three handlers, innermost first. The event travelled outward through every ancestor — that ripple is what makes delegation possible.',
        explainHi: 'Ek click, teen handlers, sabse andar wala pehle. Event har ancestor se hokar bahar gaya — yahi lehar delegation ko sambhav banati hai.',
      },
      {
        title: 'target versus currentTarget',
        titleHi: 'target versus currentTarget',
        code: `// <div id="card"><button><span>Buy</span></button></div>

document.getElementById('card').addEventListener('click', (e) => {
  console.log('target:', e.target.tagName);
  console.log('currentTarget:', e.currentTarget.id);
  console.log('closest button:', e.target.closest('button')?.tagName);
});

document.querySelector('span').click();`,
        output: `target: SPAN
currentTarget: card
closest button: BUTTON`,
        explain: 'The user aimed at the button but hit the `span` inside it. `closest()` walks up from wherever they landed to the element you actually care about.',
        explainHi: 'User ne button par nishana lagaya par uske andar ke `span` par laga. `closest()` jahan wo pahuncha wahan se upar chalkar us element tak jata hai jo aapko sach mein chahiye.',
      },
      {
        title: 'The problem delegation solves',
        titleHi: 'Delegation jo samasya sulajhata hai',
        code: `const list = document.querySelector('#list');

// ❌ attach to existing buttons only
document.querySelectorAll('.del').forEach(b =>
  b.addEventListener('click', () => console.log('deleted (direct)')),
);

const li = document.createElement('li');
li.innerHTML = '<button class="del">x</button>';
list.append(li);

li.querySelector('.del').click();
console.log('↑ nothing logged — the new button has no listener');`,
        output: `↑ nothing logged — the new button has no listener`,
        explain: 'The loop ran before this button existed, so it never got a listener. Every dynamically added item has this problem.',
        explainHi: 'Loop is button ke banne se pehle chala tha, isliye usse listener mila hi nahi. Baad mein jude har item ke saath yahi samasya hoti hai.',
      },
      {
        title: 'Delegation fixes it',
        titleHi: 'Delegation isse theek karta hai',
        code: `const list = document.querySelector('#list');

list.addEventListener('click', (e) => {
  const btn = e.target.closest('.del');
  if (!btn) return;
  console.log('deleting', btn.closest('li').dataset.id);
  btn.closest('li').remove();
});

const li = document.createElement('li');
li.dataset.id = '42';
li.innerHTML = '<button class="del">x</button>';
list.append(li);

li.querySelector('.del').click();
console.log('items left:', list.children.length);`,
        output: `deleting 42
items left: 0`,
        explain: 'One listener on the parent, and it worked for an element created after the listener was attached. The `if (!btn) return` guard makes clicks elsewhere in the list harmless.',
        explainHi: 'Parent par ek listener, aur wo us element par bhi chala jo listener lagne ke baad bana. `if (!btn) return` guard list mein kahin aur click ko harmless bana deta hai.',
      },
      {
        title: 'preventDefault versus stopPropagation',
        titleHi: 'preventDefault versus stopPropagation',
        code: `document.body.addEventListener('click', () => console.log('body heard it'));

const link = document.querySelector('a');
link.addEventListener('click', (e) => {
  e.preventDefault();          // do not navigate
  console.log('link handled, navigation cancelled');
});
link.click();

const btn = document.querySelector('#quiet');
btn.addEventListener('click', (e) => {
  e.stopPropagation();         // do not let it bubble
  console.log('button handled, body will NOT hear it');
});
btn.click();`,
        output: `link handled, navigation cancelled
body heard it
button handled, body will NOT hear it`,
        explain: 'Notice the link case still bubbled to body — `preventDefault` only cancelled navigation. `stopPropagation` is what silenced the body handler.',
        explainHi: 'Dhyan do link wala case phir bhi body tak bubble hua — `preventDefault` ne sirf navigation roka. Body handler ko chup `stopPropagation` ne karaya.',
      },
      {
        title: 'Form submit — the classic',
        titleHi: 'Form submit — classic',
        code: `const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();          // stop the page reloading
  const data = Object.fromEntries(new FormData(form));
  console.log('would send:', data);
});

form.requestSubmit();`,
        output: `would send: { email: 'jay@example.com', name: 'Jay' }`,
        explain: 'Without `preventDefault` the browser reloads the page and your JavaScript never runs. `FormData` plus `Object.fromEntries` reads every named field in one line.',
        explainHi: 'Bina `preventDefault` ke browser page reload kar deta hai aur aapka JavaScript chalta hi nahi. `FormData` aur `Object.fromEntries` ek line mein har named field padh lete hain.',
      },
      {
        title: 'Removing listeners properly',
        titleHi: 'Listeners theek se hataana',
        code: `const btn = document.querySelector('button');

btn.addEventListener('click', () => console.log('anon'));
btn.removeEventListener('click', () => console.log('anon'));
btn.click();

const named = () => console.log('named');
btn.addEventListener('click', named);
btn.removeEventListener('click', named);
btn.click();
console.log('↑ only "anon" logged — the anonymous one was never removed');`,
        output: `anon
↑ only "anon" logged — the anonymous one was never removed`,
        explain: 'Two identical-looking arrow functions are two different objects, so the first `remove` matched nothing. Always keep a reference — or use `{ once: true }` or an AbortController.',
        explainHi: 'Do ek jaise dikhne wale arrow functions do alag objects hain, isliye pehla `remove` kisi se match hi nahi hua. Hamesha reference rakho — ya `{ once: true }` ya AbortController use karo.',
      },
      {
        title: 'AbortController — clean up everything at once',
        titleHi: 'AbortController — sab ek saath saaf',
        code: `const ac = new AbortController();
const btn = document.querySelector('button');

btn.addEventListener('click', () => console.log('a'), { signal: ac.signal });
btn.addEventListener('click', () => console.log('b'), { signal: ac.signal });
window.addEventListener('resize', () => console.log('c'), { signal: ac.signal });

btn.click();
ac.abort();
btn.click();
console.log('↑ after abort, nothing fires');`,
        output: `a
b
↑ after abort, nothing fires`,
        explain: 'One `abort()` removed three listeners across two different elements. This is the cleanest teardown available, and exactly what a component unmount should do.',
        explainHi: 'Ek `abort()` ne do alag elements par lage teen listeners hata diye. Ye sabse saaf teardown hai, aur component unmount par bilkul yahi hona chahiye.',
      },
    ],

    mistakes: [
      {
        wrong: `items.forEach(i => i.addEventListener('click', fn));  // ❌ new items get nothing`,
        right: `list.addEventListener('click', e => {\n  const item = e.target.closest('.item');\n  if (item) fn(item);\n});  // ✅`,
        why: 'Direct listeners only attach to elements that exist right now. Delegation on the parent covers everything added later.',
        whyHi: 'Seedhe listeners sirf un elements par lagte hain jo abhi maujood hain. Parent par delegation baad mein jude sab kuch cover karta hai.',
      },
      {
        wrong: `if (e.target.matches('.btn')) …  // ❌ fails if an icon is inside the button`,
        right: `const btn = e.target.closest('.btn');\nif (btn) …  // ✅`,
        why: '`target` is the deepest element clicked, which is often a child. `closest` walks up to the element you actually meant.',
        whyHi: '`target` sabse andar wala clicked element hota hai, jo aksar koi bachcha hota hai. `closest` upar chalkar us element tak jata hai jo aapka matlab tha.',
      },
      {
        wrong: `form.addEventListener('submit', save);  // ❌ page reloads, save never finishes`,
        right: `form.addEventListener('submit', e => {\n  e.preventDefault();\n  save();\n});  // ✅`,
        why: 'The browser\'s default submit navigates away and tears down your script mid-run.',
        whyHi: 'Browser ka default submit page badal deta hai aur aapke script ko beech mein hi khatam kar deta hai.',
      },
      {
        wrong: `el.addEventListener('scroll', heavyFn);  // ❌ fires hundreds of times a second`,
        right: `el.addEventListener('scroll', throttle(heavyFn, 100), { passive: true });  // ✅`,
        why: 'Scroll and mousemove fire extremely often. Throttle the handler and mark it passive so the browser need not wait to see if you call preventDefault.',
        whyHi: 'Scroll aur mousemove bahut baar chalte hain. Handler ko throttle karo aur passive mark karo taaki browser preventDefault ka intezaar na kare.',
      },
    ],

    realWorld: [
      {
        en: '**Any list with actions.** Todo lists, tables with row buttons, chat messages with reactions — all delegation, because rows come and go constantly.',
        hi: '**Har wo list jisme actions hain.** Todo lists, row buttons wale tables, reactions wale chat messages — sab delegation, kyunki rows lagatar aati-jati rehti hain.',
      },
      {
        en: '**Modals and dropdowns.** "Close when the user clicks outside" is a document-level listener checking `if (!e.target.closest(".modal")) close()`.',
        hi: '**Modals aur dropdowns.** "Bahar click par band karo" ek document-level listener hai jo `if (!e.target.closest(".modal")) close()` check karta hai.',
      },
      {
        en: '**Keyboard shortcuts.** A single `keydown` listener on `document` checking `e.key` and `e.ctrlKey` is how Ctrl+K opens a command palette.',
        hi: '**Keyboard shortcuts.** `document` par ek `keydown` listener jo `e.key` aur `e.ctrlKey` dekhta hai — Ctrl+K se command palette aise hi khulta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What is event bubbling?',
        qHi: 'Event bubbling kya hai?',
        a: 'After firing on the target element, an event propagates upward through every ancestor to the document. A listener on any ancestor will therefore receive events that originated in its descendants. This is what makes event delegation possible.',
        aHi: 'Target element par chalne ke baad event har ancestor se hokar upar document tak jata hai. Isliye kisi bhi ancestor par laga listener apne descendants se shuru hue events pa leta hai. Isi se event delegation sambhav hota hai.',
      },
      {
        q: 'What is event delegation and why use it?',
        qHi: 'Event delegation kya hai aur kyun use karein?',
        a: 'Attaching one listener to a common ancestor instead of one to each child, then identifying the source with `e.target.closest(selector)`. It uses far less memory, and it automatically handles elements added to the DOM after the listener was attached.',
        aHi: 'Har bachche par ek-ek ke bajaye ek common ancestor par ek listener lagana, phir `e.target.closest(selector)` se source pehchanna. Isme memory bahut kam lagti hai, aur listener lagne ke baad DOM mein jude elements bhi apne aap sambhal jate hain.',
      },
      {
        q: 'What is the difference between `target` and `currentTarget`?',
        qHi: '`target` aur `currentTarget` mein kya fark hai?',
        a: '`target` is the element where the event originated — the deepest node under the pointer. `currentTarget` is the element whose listener is currently running. In delegation they differ, which is exactly why you need `closest()`.',
        aHi: '`target` wo element hai jahan event shuru hua — pointer ke neeche ka sabse gehra node. `currentTarget` wo element hai jiska listener abhi chal raha hai. Delegation mein ye alag hote hain, aur isiliye `closest()` chahiye.',
      },
      {
        q: 'What is the difference between `preventDefault` and `stopPropagation`?',
        qHi: '`preventDefault` aur `stopPropagation` mein kya fark hai?',
        a: '`preventDefault` cancels the browser\'s built-in action — following a link, submitting a form, checking a checkbox — but the event still bubbles. `stopPropagation` halts the event\'s travel to ancestors but the default action still happens. They are independent.',
        aHi: '`preventDefault` browser ka built-in action rokta hai — link kholna, form submit karna, checkbox check karna — par event phir bhi bubble karta hai. `stopPropagation` event ka ancestors tak safar rokta hai par default action phir bhi hota hai. Dono swatantra hain.',
      },
      {
        q: 'Why might `removeEventListener` fail to remove a listener?',
        qHi: '`removeEventListener` listener hataane mein fail kyun ho sakta hai?',
        a: 'Because it matches on the exact function reference. Passing a new inline arrow function — even one with identical code — removes nothing, since it is a different object. Keep a named reference, or use `{ once: true }` or an AbortController signal.',
        aHi: 'Kyunki wo bilkul wahi function reference dhoondhta hai. Naya inline arrow function dena — chahe code bilkul same ho — kuch nahi hataega, kyunki wo alag object hai. Named reference rakho, ya `{ once: true }` ya AbortController signal use karo.',
      },
    ],

    exercises: [
      {
        task: 'Build a todo list where clicking any item toggles a `done` class, using ONE delegated listener. Add new items dynamically and confirm they work without extra wiring.',
        taskHi: 'Aisi todo list banao jahan kisi bhi item par click karne se `done` class toggle ho, EK delegated listener se. Naye items dynamically jodo aur confirm karo ki wo bina extra wiring ke chalte hain.',
        hint: 'Listen on the `<ul>`, then `e.target.closest("li")`. Return early when the click was not on an item.',
        hintHi: '`<ul>` par suno, phir `e.target.closest("li")`. Item par click na ho to jaldi return kar do.',
      },
      {
        task: 'Build a modal that closes when you click the backdrop or press Escape, but NOT when you click inside the modal itself.',
        taskHi: 'Aisa modal banao jo backdrop click ya Escape par band ho, par modal ke andar click karne par NAHI.',
        hint: 'On the backdrop listener use `if (e.target.closest(".modal-content")) return;`. Add a `keydown` listener on document checking `e.key === "Escape"`.',
        hintHi: 'Backdrop listener mein `if (e.target.closest(".modal-content")) return;` lagao. Document par `keydown` listener lagao jo `e.key === "Escape"` check kare.',
      },
      {
        task: 'Attach three listeners using a single AbortController signal, then abort it and prove none of them fire any more.',
        taskHi: 'Ek hi AbortController signal se teen listeners lagao, phir usse abort karo aur sabit karo ki ab koi bhi nahi chalta.',
        hint: 'Pass `{ signal: ac.signal }` as the third argument to each `addEventListener`, then call `ac.abort()` once.',
        hintHi: 'Har `addEventListener` ko teesre argument mein `{ signal: ac.signal }` do, phir ek baar `ac.abort()` bulao.',
      },
    ],

    keyTakeaways: [
      'Events fire on the target, then bubble upward through every ancestor to `document`.',
      '`e.target` is what was clicked; `e.currentTarget` is where the listener lives.',
      'Delegation: one listener on the parent plus `e.target.closest(sel)` — and it covers future elements.',
      '`preventDefault` stops the browser\'s action; `stopPropagation` stops the event travelling.',
      '`removeEventListener` needs the identical function reference to work.',
      '`{ once: true }`, `{ passive: true }` and AbortController signals cover most cleanup needs.',
    ],
    keyTakeawaysHi: [
      'Events target par chalte hain, phir har ancestor se hokar `document` tak upar bubble karte hain.',
      '`e.target` wo hai jispar click hua; `e.currentTarget` wahan hai jahan listener laga hai.',
      'Delegation: parent par ek listener aur `e.target.closest(sel)` — aur ye aage banne wale elements bhi cover karta hai.',
      '`preventDefault` browser ka action rokta hai; `stopPropagation` event ka safar.',
      '`removeEventListener` ko chalne ke liye bilkul wahi function reference chahiye.',
      '`{ once: true }`, `{ passive: true }` aur AbortController signals zyadatar cleanup zarurat poori kar dete hain.',
    ],
  },

  /* ══════════════════════ Fetch & HTTP ══════════════════════ */
  {
    slug: 'fetch-and-http',
    title: 'Fetch, HTTP and APIs',
    titleHi: 'Fetch, HTTP aur APIs',
    description: 'Ordering by post — a method, an address, an envelope and a reply with a status code.',
    descriptionHi: 'Dak se order karna — ek method, ek pata, ek lifafa, aur status code wala jawab.',
    difficulty: 'MEDIUM',
    duration: 38,
    order: 3,

    analogy: {
      en: '**Ordering something by post.** You write **what you want done** (the method: send me / add this / delete that), **where** (the URL), notes on the envelope (**headers**), and the contents (**body**). The reply comes back with a stamp saying how it went — 200 delivered, 404 no such address, 500 the warehouse is on fire.',
      hi: '**Dak se kuch mangwana.** Aap likhte ho **kya karna hai** (method: bhejo / ye jodo / wo hatao), **kahan** (URL), lifafe par notes (**headers**), aur andar ka saaman (**body**). Jawab ek mohar ke saath aata hai jo batati hai kya hua — 200 pahunch gaya, 404 aisa koi pata nahi, 500 godaam mein aag lagi hai.',
    },

    simple: `**Fetching data is two awaits.**

\`\`\`js
const res = await fetch('/api/users');
const users = await res.json();
\`\`\`

Why two? The first resolves when the **headers** arrive — you know the status but not the content yet. The second waits for the **body** to finish downloading and parses it.

**The one thing that catches everyone**

\`\`\`js
const res = await fetch('/api/does-not-exist');
// This does NOT throw. res.ok is false, but no error was raised.
\`\`\`

\`fetch\` only rejects when the request could not be *made* — no network, DNS failure, CORS block. A 404 or a 500 means the server answered, and as far as \`fetch\` is concerned, that is a success.

**So you must check yourself, every single time:**

\`\`\`js
const res = await fetch(url);
if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
const data = await res.json();
\`\`\`

**The methods**

\`\`\`
GET     give me something          (no body)
POST    here is something new
PUT     replace it entirely
PATCH   change part of it
DELETE  remove it
\`\`\`

**Status codes — read the first digit**

\`\`\`
2xx  it worked          200 OK, 201 Created, 204 No Content
3xx  it moved           301 Moved, 304 Not Modified
4xx  YOU made a mistake 400 Bad Request, 401 Not logged in,
                        403 Not allowed, 404 Not found
5xx  THEY made a mistake 500 Server Error, 503 Unavailable
\`\`\`

That 4xx/5xx split matters: **retrying a 4xx is pointless** — you sent something wrong and will send it wrong again. Retrying a 5xx often works.

**Sending data**

\`\`\`js
await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Jay' }),
});
\`\`\`

Three things every POST needs: the method, the \`Content-Type\` header, and a **stringified** body. Forget the header and most servers will ignore your data entirely.

**Remember:** always check \`res.ok\`. \`fetch\` does not throw on 404.`,

    simpleHi: `**Data laana do await hai.**

\`\`\`js
const res = await fetch('/api/users');
const users = await res.json();
\`\`\`

Do kyun? Pehla tab poora hota hai jab **headers** aa jate hain — status pata chal jata hai par content nahi. Doosra **body** ke poore download hone ka intezaar karta hai aur usse parse karta hai.

**Ek cheez jo sabko pakadti hai**

\`\`\`js
const res = await fetch('/api/does-not-exist');
// Ye throw NAHI karta. res.ok false hai, par koi error nahi aaya.
\`\`\`

\`fetch\` sirf tab reject karta hai jab request *bheji hi na ja sake* — network na ho, DNS fail ho, CORS roke. 404 ya 500 ka matlab hai server ne jawab diya, aur \`fetch\` ke hisaab se wo success hai.

**Isliye har baar khud check karna padta hai:**

\`\`\`js
const res = await fetch(url);
if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
const data = await res.json();
\`\`\`

**Methods**

\`\`\`
GET     mujhe kuch do              (body nahi)
POST    ye nayi cheez lo
PUT     poora badal do
PATCH   ek hissa badlo
DELETE  hata do
\`\`\`

**Status codes — pehla ank padho**

\`\`\`
2xx  kaam ho gaya        200 OK, 201 Created, 204 No Content
3xx  jagah badal gayi    301 Moved, 304 Not Modified
4xx  AAPNE galti ki      400 Bad Request, 401 Login nahi,
                         403 Ijazat nahi, 404 Nahi mila
5xx  UNHONE galti ki     500 Server Error, 503 Unavailable
\`\`\`

Wo 4xx/5xx ka bantwara zaroori hai: **4xx par retry bekaar hai** — aapne kuch galat bheja tha aur phir galat hi bhejoge. 5xx par retry aksar chal jata hai.

**Data bhejna**

\`\`\`js
await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Jay' }),
});
\`\`\`

Har POST ko teen cheezein chahiye: method, \`Content-Type\` header, aur **stringify** kiya hua body. Header bhool gaye to zyadatar servers aapka data poori tarah ignore kar denge.

**Yaad rakho:** hamesha \`res.ok\` check karo. \`fetch\` 404 par throw nahi karta.`,

    content: `## The response object

\`\`\`js
res.ok          // true for 200–299
res.status      // 404
res.statusText  // 'Not Found'
res.headers.get('content-type')
await res.json()   // parse as JSON
await res.text()   // as a string
await res.blob()   // as binary — images, downloads
\`\`\`

A body can only be read **once**. Calling \`res.json()\` after \`res.text()\` throws "body stream already read". Clone it with \`res.clone()\` if you truly need both.

## A reusable wrapper

\`\`\`js
async function api(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new HttpError(res.status, body);
  }

  return res.status === 204 ? null : res.json();
}
\`\`\`

Note the 204 check — "No Content" has an empty body, and calling \`.json()\` on it throws.

## Timeouts and cancellation

\`fetch\` has no built-in timeout; it will wait forever.

\`\`\`js
const ac = new AbortController();
const timer = setTimeout(() => ac.abort(), 5000);

try {
  const res = await fetch(url, { signal: ac.signal });
  return await res.json();
} catch (err) {
  if (err.name === 'AbortError') throw new Error('Request timed out');
  throw err;
} finally {
  clearTimeout(timer);
}
\`\`\`

The same \`AbortController\` cancels a stale request when a user types a new search term.

## Parallel requests

\`\`\`js
// ❌ 3 seconds
const user = await api('/user');
const posts = await api('/posts');
const tags = await api('/tags');

// ✅ 1 second
const [user, posts, tags] = await Promise.all([
  api('/user'), api('/posts'), api('/tags'),
]);
\`\`\`

Use \`Promise.allSettled\` when a dashboard should still render the panels that succeeded.

## Retrying — only what is worth retrying

\`\`\`js
async function withRetry(fn, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (err.status && err.status < 500) throw err;   // 4xx: your fault, do not retry
      if (i === tries - 1) throw err;
      await sleep(2 ** i * 200);                        // exponential backoff
    }
  }
}
\`\`\`

## CORS in one paragraph

A browser will not let page A read a response from origin B unless B says it may, using an \`Access-Control-Allow-Origin\` header. The block happens in the *browser*, not on the server — the request usually arrived fine. That is why the same URL works in Postman and fails in the page, and why the fix must be made on the server.`,

    contentHi: `## Response object

\`\`\`js
res.ok          // 200–299 ke liye true
res.status      // 404
res.statusText  // 'Not Found'
res.headers.get('content-type')
await res.json()   // JSON ki tarah parse
await res.text()   // string ki tarah
await res.blob()   // binary — images, downloads
\`\`\`

Body sirf **ek baar** padha ja sakta hai. \`res.text()\` ke baad \`res.json()\` bulane par "body stream already read" error aata hai. Dono sach mein chahiye to \`res.clone()\` karo.

## Ek reusable wrapper

\`\`\`js
async function api(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new HttpError(res.status, body);
  }

  return res.status === 204 ? null : res.json();
}
\`\`\`

204 wala check dhyan se dekho — "No Content" ka body khaali hota hai, aur uspar \`.json()\` bulane se error aata hai.

## Timeouts aur cancellation

\`fetch\` mein built-in timeout hai hi nahi; wo hamesha intezaar karta rahega.

\`\`\`js
const ac = new AbortController();
const timer = setTimeout(() => ac.abort(), 5000);

try {
  const res = await fetch(url, { signal: ac.signal });
  return await res.json();
} catch (err) {
  if (err.name === 'AbortError') throw new Error('Request timed out');
  throw err;
} finally {
  clearTimeout(timer);
}
\`\`\`

Wahi \`AbortController\` tab bhi kaam aata hai jab user naya search term likhta hai aur purani request rad karni hoti hai.

## Parallel requests

\`\`\`js
// ❌ 3 second
const user = await api('/user');
const posts = await api('/posts');
const tags = await api('/tags');

// ✅ 1 second
const [user, posts, tags] = await Promise.all([
  api('/user'), api('/posts'), api('/tags'),
]);
\`\`\`

Jab dashboard ko safal panels phir bhi dikhane hon, tab \`Promise.allSettled\` use karo.

## Retry — sirf wahi jo retry layak hai

\`\`\`js
async function withRetry(fn, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (err.status && err.status < 500) throw err;   // 4xx: aapki galti, retry mat karo
      if (i === tries - 1) throw err;
      await sleep(2 ** i * 200);                        // exponential backoff
    }
  }
}
\`\`\`

## CORS ek paragraph mein

Browser page A ko origin B ka response tab tak padhne nahi dega jab tak B \`Access-Control-Allow-Origin\` header se ijazat na de. Rok *browser* mein lagti hai, server par nahi — request aksar theek se pahunch chuki hoti hai. Isiliye wahi URL Postman mein chalta hai aur page mein fail hota hai, aur isiliye ilaaj server par hi karna padta hai.`,

    examples: [
      {
        title: 'The two awaits',
        titleHi: 'Do await',
        code: `const res = await fetch('/api/users');

console.log('status:', res.status);
console.log('ok:', res.ok);
console.log('type:', res.headers.get('content-type'));

const users = await res.json();
console.log('count:', users.length);`,
        output: `status: 200
ok: true
type: application/json
count: 3`,
        explain: 'After the first await you already know the status — before a single byte of the body has downloaded. That is why a large response can be rejected early.',
        explainHi: 'Pehle await ke baad hi status pata chal jata hai — body ka ek byte download hone se pehle. Isiliye bade response ko jaldi reject kiya ja sakta hai.',
      },
      {
        title: 'fetch does not throw on 404',
        titleHi: 'fetch 404 par throw nahi karta',
        code: `try {
  const res = await fetch('/api/nope');
  console.log('no error thrown!');
  console.log('ok:', res.ok, 'status:', res.status);
} catch (err) {
  console.log('caught:', err.message);
}`,
        output: `no error thrown!
ok: false status: 404`,
        explain: 'The `catch` never ran. If you go straight to `res.json()` here you will try to parse an HTML error page and get a confusing SyntaxError instead of a clear 404.',
        explainHi: '`catch` chala hi nahi. Agar aap yahan seedhe `res.json()` par jaate ho to HTML error page parse karne ki koshish hogi aur saaf 404 ke bajaye uljhan wala SyntaxError milega.',
      },
      {
        title: 'Checking res.ok properly',
        titleHi: 'res.ok theek se check karna',
        code: `async function getUser(id) {
  const res = await fetch(\`/api/users/\${id}\`);
  if (!res.ok) {
    throw new Error(\`HTTP \${res.status} \${res.statusText}\`);
  }
  return res.json();
}

try {
  await getUser(999);
} catch (err) {
  console.log('Caught:', err.message);
}`,
        output: `Caught: HTTP 404 Not Found`,
        explain: 'Now the failure is a real error with a useful message, and the caller can decide what to do with it. Four lines that belong in every fetch you write.',
        explainHi: 'Ab failure ek asli error hai kaam ke message ke saath, aur caller tay kar sakta hai ki kya karna hai. Ye chaar lines aapke har fetch mein honi chahiye.',
      },
      {
        title: 'POSTing JSON',
        titleHi: 'JSON POST karna',
        code: `const res = await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Jay', email: 'jay@example.com' }),
});

console.log('status:', res.status);
const created = await res.json();
console.log('created id:', created.id);`,
        output: `status: 201
created id: 42`,
        explain: '201 means "Created" — the resource now exists. Note `JSON.stringify`: passing the object directly sends the literal string "[object Object]".',
        explainHi: '201 matlab "Created" — resource ab exist karta hai. `JSON.stringify` dhyan se dekho: object seedhe bhejne par literal string "[object Object]" jaati hai.',
      },
      {
        title: 'Forgetting Content-Type',
        titleHi: 'Content-Type bhoolna',
        code: `// ❌ no header — most servers parse this as text and see an empty body
const bad = await fetch('/api/echo', {
  method: 'POST',
  body: JSON.stringify({ name: 'Jay' }),
});
console.log('server saw:', await bad.json());

// ✅
const good = await fetch('/api/echo', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Jay' }),
});
console.log('server saw:', await good.json());`,
        output: `server saw: {}
server saw: { name: 'Jay' }`,
        explain: 'The body was identical both times. Without the header the server did not know to parse it as JSON, so `req.body` was empty. A genuinely maddening bug to track down.',
        explainHi: 'Body dono baar bilkul same tha. Bina header ke server ko pata hi nahi chala ki use JSON ki tarah parse karna hai, isliye `req.body` khaali raha. Ye bug dhoondhna sach mein pagal kar deta hai.',
      },
      {
        title: 'The body can only be read once',
        titleHi: 'Body sirf ek baar padha ja sakta hai',
        code: `const res = await fetch('/api/users');

const text = await res.text();
console.log('as text, length:', text.length);

try {
  await res.json();
} catch (err) {
  console.log('Second read failed:', err.message);
}

const res2 = await fetch('/api/users');
const clone = res2.clone();
console.log(typeof await clone.text(), typeof await res2.json());`,
        output: `as text, length: 87
Second read failed: Body is unusable: Body has already been read
string object`,
        explain: 'The body is a one-pass stream. `clone()` before the first read is the only way to consume it twice — useful when logging a response you also want to parse.',
        explainHi: 'Body ek-baar-padhne wali stream hai. Pehle read se pehle `clone()` hi ekmatra tarika hai dobara padhne ka — us response ko log karte waqt kaam aata hai jise aap parse bhi karna chahte ho.',
      },
      {
        title: 'Parallel versus sequential',
        titleHi: 'Parallel versus sequential',
        code: `console.time('sequential');
const a1 = await fetch('/api/user').then(r => r.json());
const b1 = await fetch('/api/posts').then(r => r.json());
const c1 = await fetch('/api/tags').then(r => r.json());
console.timeEnd('sequential');

console.time('parallel');
const [a2, b2, c2] = await Promise.all([
  fetch('/api/user').then(r => r.json()),
  fetch('/api/posts').then(r => r.json()),
  fetch('/api/tags').then(r => r.json()),
]);
console.timeEnd('parallel');`,
        output: `sequential: 921ms
parallel: 312ms`,
        explain: 'Three independent requests, three times faster. Unless a later request needs an earlier response, they should always go together.',
        explainHi: 'Teen alag requests, teen guna tez. Jab tak baad wali request ko pehle ka response na chahiye, unhe hamesha saath jana chahiye.',
      },
      {
        title: 'Timeout with AbortController',
        titleHi: 'AbortController se timeout',
        code: `async function fetchWithTimeout(url, ms = 5000) {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), ms);
  try {
    const res = await fetch(url, { signal: ac.signal });
    return await res.json();
  } catch (err) {
    if (err.name === 'AbortError') throw new Error(\`Timed out after \${ms}ms\`);
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

try {
  await fetchWithTimeout('/api/very-slow', 1000);
} catch (err) {
  console.log(err.message);
}`,
        output: `Timed out after 1000ms`,
        explain: '`fetch` waits forever by default. The `finally` matters — without `clearTimeout` a successful fast request would leave a stray timer running.',
        explainHi: '`fetch` default mein hamesha intezaar karta hai. `finally` zaroori hai — bina `clearTimeout` ke jaldi safal hui request ek bhatakta hua timer chhod deti.',
      },
      {
        title: 'Retrying only 5xx',
        titleHi: 'Sirf 5xx par retry',
        code: `class HttpError extends Error {
  constructor(status) { super(\`HTTP \${status}\`); this.status = status; }
}

async function withRetry(fn, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (err.status < 500) { console.log('4xx — not retrying'); throw err; }
      console.log(\`attempt \${i + 1} failed, retrying…\`);
      if (i === tries - 1) throw err;
    }
  }
}

try {
  await withRetry(async () => { throw new HttpError(400); });
} catch (e) { console.log('gave up:', e.message); }`,
        output: `4xx — not retrying
gave up: HTTP 400`,
        explain: 'A 400 means your request was malformed — sending it again changes nothing and just wastes the server\'s time. Only 5xx and network errors deserve a retry.',
        explainHi: '400 matlab aapki request hi galat thi — dobara bhejne se kuch nahi badlega aur server ka waqt hi barbaad hoga. Sirf 5xx aur network errors retry ke layak hain.',
      },
    ],

    mistakes: [
      {
        wrong: `const data = await (await fetch(url)).json();  // ❌ no status check`,
        right: `const res = await fetch(url);\nif (!res.ok) throw new Error(\`HTTP \${res.status}\`);\nconst data = await res.json();  // ✅`,
        why: '`fetch` resolves for 404 and 500 too. Skipping `res.ok` turns a clear HTTP error into a confusing JSON parse error.',
        whyHi: '`fetch` 404 aur 500 par bhi resolve hota hai. `res.ok` chhodne se saaf HTTP error uljhan wale JSON parse error mein badal jata hai.',
      },
      {
        wrong: `body: { name: 'Jay' }  // ❌ sends "[object Object]"`,
        right: `body: JSON.stringify({ name: 'Jay' })  // ✅`,
        why: 'The body must be a string, a FormData or a Blob. An object is coerced to the useless string "[object Object]".',
        whyHi: 'Body string, FormData ya Blob honi chahiye. Object bekaar string "[object Object]" ban jata hai.',
      },
      {
        wrong: `for (const id of ids) await fetchUser(id);  // ❌ N sequential round trips`,
        right: `await Promise.all(ids.map(fetchUser));  // ✅ all at once`,
        why: 'Awaiting inside a loop serialises independent network calls, multiplying total latency by N.',
        whyHi: 'Loop ke andar await karne se alag-alag network calls ek-ek karke chalti hain, aur kul latency N guna ho jati hai.',
      },
      {
        wrong: `await res.text();\nawait res.json();  // ❌ body already consumed`,
        right: `const clone = res.clone();\nawait clone.text();\nawait res.json();  // ✅`,
        why: 'A response body is a single-use stream. Clone before the first read if you need it twice.',
        whyHi: 'Response body ek-baar-use wali stream hai. Dobara chahiye to pehle read se pehle clone karo.',
      },
    ],

    realWorld: [
      {
        en: '**Search-as-you-type.** Every keystroke fires a request, so you debounce the input and abort the previous request — otherwise an older, slower response can overwrite a newer one.',
        hi: '**Search-as-you-type.** Har keystroke ek request bhejti hai, isliye input debounce karo aur pichli request abort karo — warna purana, dheema response naye ko overwrite kar sakta hai.',
      },
      {
        en: '**Auth headers.** A shared `api()` wrapper attaches the bearer token, handles a 401 by refreshing, and retries once — writing that per call site is how tokens get forgotten.',
        hi: '**Auth headers.** Ek saanjha `api()` wrapper bearer token lagata hai, 401 par refresh karta hai, aur ek baar retry karta hai — har call par ye likhna hi wo tarika hai jisse tokens bhool jate hain.',
      },
      {
        en: '**File uploads.** Use `FormData` and do NOT set `Content-Type` — the browser must add the multipart boundary itself, and setting it manually breaks the upload.',
        hi: '**File uploads.** `FormData` use karo aur `Content-Type` set MAT karo — browser ko khud multipart boundary jodni hoti hai, aur usse haath se set karna upload toad deta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does `fetch` not reject on a 404?',
        qHi: '`fetch` 404 par reject kyun nahi karta?',
        a: 'Because the HTTP transaction succeeded — the server was reached and it replied. `fetch` only rejects on network-level failures: DNS resolution failure, connection refused, CORS block, or an aborted request. HTTP status is application-level information you must inspect via `response.ok`.',
        aHi: 'Kyunki HTTP transaction safal tha — server tak pahunch hui aur usne jawab diya. `fetch` sirf network-level failures par reject karta hai: DNS fail, connection refuse, CORS block, ya abort ki gayi request. HTTP status application-level jaankari hai jise `response.ok` se khud dekhna padta hai.',
      },
      {
        q: 'Why are there two awaits in a typical fetch?',
        qHi: 'Aam fetch mein do await kyun hote hain?',
        a: 'The first resolves when the response headers arrive, giving you the status immediately. The second waits for the body to stream in fully and parses it. Splitting them lets you reject a bad status before downloading a potentially large body.',
        aHi: 'Pehla tab poora hota hai jab response headers aate hain, jisse status turant mil jata hai. Doosra body ke poora stream hone ka intezaar karke usse parse karta hai. Inhe alag rakhne se aap bada body download karne se pehle hi kharab status reject kar sakte ho.',
      },
      {
        q: 'What is CORS and where is it enforced?',
        qHi: 'CORS kya hai aur wo kahan lagu hota hai?',
        a: 'Cross-Origin Resource Sharing. The browser blocks a page on origin A from *reading* a response from origin B unless B returns an `Access-Control-Allow-Origin` header permitting it. Enforcement is entirely in the browser — the request often reached the server fine, which is why the same call works in curl or Postman. The fix must be applied on the server.',
        aHi: 'Cross-Origin Resource Sharing. Browser origin A ke page ko origin B ka response *padhne* se rokta hai jab tak B `Access-Control-Allow-Origin` header se ijazat na de. Ye poori tarah browser mein lagu hota hai — request aksar server tak theek pahunch jati hai, isiliye wahi call curl ya Postman mein chalti hai. Ilaaj server par hi karna padta hai.',
      },
      {
        q: 'How do you add a timeout to a fetch?',
        qHi: 'Fetch par timeout kaise lagate hain?',
        a: '`fetch` has no timeout option, so use an `AbortController`: start a `setTimeout` that calls `controller.abort()`, pass `controller.signal` to fetch, and catch the resulting `AbortError`. Clear the timer in a `finally` so a fast success does not leave it running.',
        aHi: '`fetch` mein timeout option hai hi nahi, isliye `AbortController` use karo: ek `setTimeout` chalao jo `controller.abort()` bulaye, fetch ko `controller.signal` do, aur aane wala `AbortError` catch karo. Timer ko `finally` mein clear karo taaki jaldi safalta par wo chalta na rah jaye.',
      },
      {
        q: 'Which HTTP failures are worth retrying?',
        qHi: 'Kaunsi HTTP failures retry ke layak hain?',
        a: '5xx responses and network errors, because those are transient server-side or connectivity problems. 4xx responses should not be retried — the request itself was invalid, so resending it produces the same result. Use exponential backoff so retries do not amplify an outage.',
        aHi: '5xx responses aur network errors, kyunki wo aarzi server-side ya connectivity samasyaein hain. 4xx retry nahi karne chahiye — request khud galat thi, isliye dobara bhejne par wahi nateeja aayega. Exponential backoff use karo taaki retries outage ko aur na badhayein.',
      },
    ],

    exercises: [
      {
        task: 'Write `api(url, options)` that sets the JSON content type, throws an `HttpError` carrying the status when `res.ok` is false, and returns `null` for a 204.',
        taskHi: '`api(url, options)` likho jo JSON content type set kare, `res.ok` false hone par status wala `HttpError` throw kare, aur 204 par `null` de.',
        hint: 'Calling `.json()` on a 204 throws because the body is empty — check the status before parsing.',
        hintHi: '204 par `.json()` bulane se error aata hai kyunki body khaali hoti hai — parse karne se pehle status check karo.',
      },
      {
        task: 'Write `loadDashboard()` fetching user, posts and notifications with `Promise.allSettled`, rendering whichever succeeded and showing an inline error for each that failed.',
        taskHi: '`loadDashboard()` likho jo `Promise.allSettled` se user, posts aur notifications laaye, safal walon ko render kare aur fail hue har ek ke liye inline error dikhaye.',
        hint: 'Each result is `{ status: "fulfilled", value }` or `{ status: "rejected", reason }`. Partial success beats a blank page.',
        hintHi: 'Har result `{ status: "fulfilled", value }` ya `{ status: "rejected", reason }` hota hai. Aadhi safalta khaali page se behtar hai.',
      },
      {
        task: 'Build a search box that fetches results as you type, debounced by 300ms, aborting the previous request each time so a slow old response cannot overwrite a fast new one.',
        taskHi: 'Aisa search box banao jo type karte waqt results laaye, 300ms debounce ke saath, aur har baar pichli request abort kare taaki purana dheema response naye tez wale ko overwrite na kar sake.',
        hint: 'Keep the current AbortController in a variable outside the handler; call `.abort()` on it before starting the next request.',
        hintHi: 'Current AbortController ko handler ke bahar ek variable mein rakho; agli request shuru karne se pehle uspar `.abort()` bulao.',
      },
    ],

    keyTakeaways: [
      'Two awaits: one for the headers, one for the body.',
      '`fetch` does NOT throw on 4xx or 5xx — always check `res.ok` yourself.',
      'POSTing JSON needs the method, a `Content-Type` header, and a `JSON.stringify`d body.',
      'Status first digit: 2xx worked, 4xx you were wrong, 5xx they were wrong. Retry only 5xx.',
      'A response body can be read once — `clone()` before the first read if you need it twice.',
      '`fetch` has no timeout; use an AbortController, which also cancels stale requests.',
    ],
    keyTakeawaysHi: [
      'Do await: ek headers ke liye, ek body ke liye.',
      '`fetch` 4xx ya 5xx par throw NAHI karta — `res.ok` hamesha khud check karo.',
      'JSON POST ko method, `Content-Type` header, aur `JSON.stringify` kiya body chahiye.',
      'Status ka pehla ank: 2xx kaam hua, 4xx aap galat the, 5xx wo galat the. Retry sirf 5xx par.',
      'Response body ek baar padha ja sakta hai — dobara chahiye to pehle read se pehle `clone()`.',
      '`fetch` mein timeout nahi hai; AbortController use karo, jo purani requests bhi rad kar deta hai.',
    ],
  },
];
