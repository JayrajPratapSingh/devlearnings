/**
 * CSS & HTML Complete Course — Module 5 (Motion), lesson 2.
 *
 * Keyframes and animation performance. The broken example is a spinner built
 * with @keyframes that quietly never stops running even when it's invisible,
 * burning battery in a background tab — the animation equivalent of a
 * memory leak, and the reason will-change and animation-play-state exist.
 *
 * NOTE for future editors: escape every inline-code backtick inside these
 * template literals, INCLUDING inside plain markdown paragraphs (the
 * `content`/`contentHi`/`simple`/`simpleHi` fields) — a plain backtick used
 * for inline code inside one of those template literals terminates the
 * literal early and produces a confusing cascade of parser errors hundreds
 * of lines away. Single-quoted string fields (explain, why, q, a, task,
 * keyTakeaways, etc.) do NOT need backticks escaped — only escape apostrophes
 * there (\').
 */

import type { CourseLesson } from './course-js-module1';

const page = (body: string, css = '') => `<!doctype html><html><head><meta charset="utf-8">
<style>
  body { font: 15px/1.5 system-ui, sans-serif; margin: 12px; color: #111; }
  ${css}
</style></head><body>${body}</body></html>`;

export const CSS_MODULE_5B: CourseLesson[] = [
  {
    slug: 'css-keyframes-animation-performance',
    title: 'Keyframes and Animation Performance',
    titleHi: 'Keyframes aur Animation Performance',
    description: 'A loading spinner that never stops spinning — even in a background tab nobody is looking at.',
    descriptionHi: 'Ek loading spinner jo kabhi ghoomna band nahi karta — background tab mein bhi jise koi dekh hi nahi raha.',
    difficulty: 'HARD',
    duration: 34,
    order: 2,

    analogy: {
      en: '**A car engine idling in a closed garage.** A `transition` is driving somewhere and stopping — it has a start, an end, and it is done. A `@keyframes` animation set to loop forever is an engine left running in a closed garage: it keeps burning fuel whether or not anyone is watching, whether the car has actually gone anywhere, and whether the garage door — the browser tab — is even open. The engine does not know to stop on its own. You have to tell it to.',
      hi: '**Band garage mein chalta hua car engine.** \`transition\` kahin drive karke rukna hai — uska ek shuruaat hai, ek ant hai, aur wo khatam ho jata hai. Hamesha loop karne wala \`@keyframes\` animation ek aisa engine hai jo band garage mein chalta chhod diya gaya hai: wo fuel jalata rehta hai chahe koi dekh raha ho ya nahi, chahe car sach mein kahin gayi ho ya nahi, aur chahe garage ka darwaza — browser tab — khula bhi ho ya nahi. Engine ko khud ruk na nahi aata. Aapko use batana padta hai.',
    },

    simple: `**Start broken.** A loading spinner:

\`\`\`css
@keyframes spin {
  to { transform: rotate(360deg); }
}
.spinner { animation: spin 1s linear infinite; }
\`\`\`

It works. It also **never stops** — \`infinite\` means exactly that. Switch to another browser tab, and the spinner keeps animating in the background, invisible, still consuming CPU and battery, because nothing told the browser it was allowed to pause. Multiply this by a dashboard with six spinners, three of which finished loading minutes ago but were never removed from the DOM, and you have a measurable, avoidable drain — this is one of the most common causes of "why is this tab eating my battery" that a profiler will show you.

**The fix has two parts. First, stop animating what finished:**

\`\`\`js
spinner.classList.remove('spinner');   // or unmount it — don't leave a finished animation running
\`\`\`

An \`infinite\` animation is a *loop you must remember to end*, the same discipline as clearing a \`setInterval\`. It is not the browser's job to guess when you are done with it.

**Second, respect the user's motion preference — always, for every animation:**

\`\`\`css
@media (prefers-reduced-motion: reduce) {
  .spinner { animation: none; }
}
\`\`\`

This is not just about battery. For a portion of users, large-scale or fast motion can cause genuine physical symptoms — dizziness, nausea — because of vestibular disorders. \`prefers-reduced-motion\` reads a setting they explicitly turned on in their operating system, and ignoring it is not a cosmetic oversight.

**\`@keyframes\` syntax, once you need more than a start and an end**

\`\`\`css
@keyframes pulse {
  0%   { transform: scale(1);    opacity: 1;   }
  50%  { transform: scale(1.08); opacity: 0.8; }
  100% { transform: scale(1);    opacity: 1;   }
}
.badge { animation: pulse 2s ease-in-out infinite; }
\`\`\`

Percentages mark waypoints along the animation's timeline; the browser interpolates smoothly between whichever ones you define. \`from\`/\`to\` are just aliases for \`0%\`/\`100%\`.

**Pausing what is off-screen**

\`\`\`css
.spinner { animation-play-state: running; }
.spinner.hidden { animation-play-state: paused; }
\`\`\`

Pairing this with an \`IntersectionObserver\` in JavaScript — pausing any animation that scrolls out of view — is standard practice for long pages with many animated elements, because an animation nobody can see is pure waste.

**Remember:** every \`infinite\` animation is a commitment you have to actively honour — stop it when it is done, pause it when it is hidden, and disable it when the user has asked you to.`,

    simpleHi: `**Toote hue se shuru.** Ek loading spinner:

\`\`\`css
@keyframes spin {
  to { transform: rotate(360deg); }
}
.spinner { animation: spin 1s linear infinite; }
\`\`\`

Ye chalta hai. Ye **kabhi rukta bhi nahi** — \`infinite\` ka bilkul yahi matlab hai. Doosre browser tab par jao, aur spinner background mein animate hota rehta hai, adrishya, phir bhi CPU aur battery kharch karte hue, kyunki kisi ne browser ko nahi bataya ki wo ruk sakta hai. Ek dashboard mein isse chhe guna karo jahan chhe spinners hain, jinme se teen minat pehle load ho chuke the par DOM se kabhi hataye hi nahi gaye, aur aapke paas ek naapa jaane wala, bacha ja sakne wala drain hai — "ye tab meri battery kyun kha rahi hai" ki sabse aam wajahon mein se ek hai jo profiler aapko dikha dega.

**Fix ke do hisse hain. Pehla, jo khatam ho gaya use animate karna band karo:**

\`\`\`js
spinner.classList.remove('spinner');   // ya use unmount karo — khatam ho chuka animation chalta mat chhodo
\`\`\`

\`infinite\` animation ek *aisa loop hai jise aapko khatam karna yaad rakhna hai*, bilkul \`setInterval\` clear karne jaisi anushasan. Ye andaza lagana browser ka kaam nahi ki aapka kaam usse ho gaya.

**Doosra, user ki motion pasand ka samman karo — hamesha, har animation ke liye:**

\`\`\`css
@media (prefers-reduced-motion: reduce) {
  .spinner { animation: none; }
}
\`\`\`

Ye sirf battery ki baat nahi hai. Kuch users ke liye, bada paimana ya tez motion sach mein sharirik lakshan paida kar sakti hai — chakkar, jee michlana — vestibular disorders ki wajah se. \`prefers-reduced-motion\` ek setting padhta hai jo unhone apne operating system mein khud jaan-boojh kar on ki, aur use anndekha karna koi dikhne wali chook nahi hai.

**\`@keyframes\` syntax, jab aapko shuruaat aur ant se zyada chahiye**

\`\`\`css
@keyframes pulse {
  0%   { transform: scale(1);    opacity: 1;   }
  50%  { transform: scale(1.08); opacity: 0.8; }
  100% { transform: scale(1);    opacity: 1;   }
}
.badge { animation: pulse 2s ease-in-out infinite; }
\`\`\`

Percentages animation ki timeline par waypoints nishaan lagate hain; browser aapke diye hue jo bhi points hain unke beech smoothly interpolate karta hai. \`from\`/\`to\` sirf \`0%\`/\`100%\` ke alias hain.

**Jo screen se bahar hai use pause karna**

\`\`\`css
.spinner { animation-play-state: running; }
.spinner.hidden { animation-play-state: paused; }
\`\`\`

Ise JavaScript mein \`IntersectionObserver\` ke saath jodna — kisi bhi animation ko pause karna jo view se scroll hokar bahar chala jata hai — kai animated elements wale lambe pages ke liye standard tarika hai, kyunki jise koi dekh hi nahi sakta wo animation sirf fizool kharch hai.

**Yaad rakho:** har \`infinite\` animation ek wachan hai jise aapko saqriya roop se nibhaana hai — khatam ho jaye to roko, chhup jaye to pause karo, aur user ne mana kiya ho to band karo.`,

    content: `## @keyframes syntax

\`\`\`css
@keyframes slideIn {
  from { transform: translateX(-100%); opacity: 0; }
  to   { transform: translateX(0);     opacity: 1; }
}

@keyframes pulse {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.1); }
  100% { transform: scale(1); }
}
\`\`\`

Each percentage is a waypoint; the browser fills in every value between the ones you specify. You can define as many waypoints as needed, and different properties can even appear at different waypoints — the browser interpolates each one independently over the timeline.

## The animation shorthand, fully expanded

\`\`\`css
animation-name: spin;
animation-duration: 1s;
animation-timing-function: linear;
animation-delay: 0s;
animation-iteration-count: infinite;   /* or a number, e.g. 3 */
animation-direction: normal;           /* normal | reverse | alternate | alternate-reverse */
animation-fill-mode: none;             /* none | forwards | backwards | both */
animation-play-state: running;         /* running | paused */

/* shorthand, same order as above minus play-state: */
animation: spin 1s linear 0s infinite normal both;
\`\`\`

## animation-fill-mode — the setting almost everyone forgets

\`\`\`css
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.el { animation: fadeIn 0.3s; }
/* without fill-mode, the element SNAPS BACK to opacity:1's default (its original CSS) the instant the animation ends */
.el { animation: fadeIn 0.3s forwards; }
/* with forwards, the element KEEPS the final keyframe's values after the animation ends */
\`\`\`

By default, once a \`@keyframes\` animation finishes, the element's styling reverts to whatever it would have been without the animation at all — the animation's final state does not persist. \`animation-fill-mode: forwards\` is what makes a fade-in or slide-in actually *stay* in its final visible state instead of jumping back. This single missing property is behind a large share of "my animation plays once then instantly disappears" bugs.

## animation-direction and alternate

\`\`\`css
@keyframes bob { 0% { transform: translateY(0); } 100% { transform: translateY(-10px); } }
.el { animation: bob 0.6s ease-in-out infinite alternate; }
\`\`\`

\`alternate\` reverses direction on every other iteration, so the animation plays forward, then backward, then forward again, producing a smooth back-and-forth without needing to write the reverse motion into the keyframes yourself.

## animation-play-state, and pausing what is offscreen

\`\`\`css
.spinner { animation-play-state: running; }
.spinner.paused { animation-play-state: paused; }
\`\`\`

\`\`\`js
const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    entry.target.classList.toggle('paused', !entry.isIntersecting);
  }
});
document.querySelectorAll('.spinner').forEach((el) => observer.observe(el));
\`\`\`

Pausing an animation that has scrolled out of view, and resuming it when it scrolls back, is the standard pattern for pages with many independently-animated elements — an animation running where nobody can see it is wasted CPU and battery for zero visible benefit.

## The battery cost of a forgotten infinite animation

\`animation-iteration-count: infinite\` never stops on its own. A finished loading spinner left in the DOM, or a decorative pulse on a component the user navigated away from without unmounting, keeps the compositor active indefinitely — this shows up directly in a laptop's energy usage and a phone's battery drain, and Chrome DevTools' Performance panel will show continuous compositor activity for a tab that is theoretically idle.

## prefers-reduced-motion in the context of animation, specifically

\`\`\`css
.hero-animation { animation: elaborate-entrance 1.2s ease-out; }

@media (prefers-reduced-motion: reduce) {
  .hero-animation { animation: none; }
  /* or, less drastically, shorten and simplify rather than fully disable: */
  .hero-animation { animation-duration: 0.01ms; }
}
\`\`\`

This is not the same audience as "users on a slow connection" or "users on an old phone" — \`prefers-reduced-motion\` specifically serves people with vestibular disorders, migraines, or motion sensitivity, for whom large parallax effects or sweeping entrance animations can cause genuine physical discomfort. Disabling or reducing the *scale* of motion (not necessarily removing all animation) is the accessible default, and every animation covered in this lesson should have a reduced-motion counterpart considered as part of building it, not bolted on afterward.

## will-change — a hint, used sparingly

\`\`\`css
.panel { will-change: transform; }   /* only while about to animate */
\`\`\`

\`will-change\` tells the browser to prepare a separate compositor layer for the element in advance, which can make the *first* frame of an animation smoother. It is not free — creating and holding extra GPU layers costs memory — and using it on many elements, or leaving it on permanently rather than removing it once the animation is done, can make performance worse, not better. It is a tool for one specific, measured problem (a janky first frame), not a general-purpose performance switch to sprinkle everywhere.`,

    contentHi: `## @keyframes syntax

\`\`\`css
@keyframes slideIn {
  from { transform: translateX(-100%); opacity: 0; }
  to   { transform: translateX(0);     opacity: 1; }
}

@keyframes pulse {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.1); }
  100% { transform: scale(1); }
}
\`\`\`

Har percentage ek waypoint hai; browser aapke diye hue points ke beech har value khud bhar deta hai. Aap jitne chahe utne waypoints define kar sakte ho, aur alag-alag properties alag-alag waypoints par bhi dikh sakti hain — browser har ek ko timeline par alag se interpolate karta hai.

## Animation shorthand, poora khula hua

\`\`\`css
animation-name: spin;
animation-duration: 1s;
animation-timing-function: linear;
animation-delay: 0s;
animation-iteration-count: infinite;   /* ya ek number, jaise 3 */
animation-direction: normal;           /* normal | reverse | alternate | alternate-reverse */
animation-fill-mode: none;             /* none | forwards | backwards | both */
animation-play-state: running;         /* running | paused */

/* shorthand, upar wala hi kram, play-state ke bina: */
animation: spin 1s linear 0s infinite normal both;
\`\`\`

## animation-fill-mode — wo setting jo lagbhag sab bhool jate hain

\`\`\`css
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.el { animation: fadeIn 0.3s; }
/* bina fill-mode ke, element opacity:1's default (uski asli CSS) par VAAPAS KUD JATA HAI animation khatam hote hi */
.el { animation: fadeIn 0.3s forwards; }
/* forwards ke saath, element animation khatam hone ke baad aakhri keyframe ki values RAKH LETA hai */
\`\`\`

Default roop se, ek \`@keyframes\` animation khatam hote hi, element ki styling waise ho jati hai jaisi wo bina animation ke hoti — animation ki aakhri sthiti bani nahi rehti. \`animation-fill-mode: forwards\` hi wo cheez hai jo fade-in ya slide-in ko sach mein apni aakhri dikhti sthiti mein *tikay rehne* deti hai, wapas kudne ke bajaye. Yahi ek gayab property "mera animation ek baar chalta hai phir turant gayab ho jata hai" jaise zyadatar bugs ke peeche hai.

## animation-direction aur alternate

\`\`\`css
@keyframes bob { 0% { transform: translateY(0); } 100% { transform: translateY(-10px); } }
.el { animation: bob 0.6s ease-in-out infinite alternate; }
\`\`\`

\`alternate\` har doosri iteration par disha ulti kar deta hai, isliye animation aage chalta hai, phir peeche, phir aage, aur ulti motion ko khud keyframes mein likhe bina smooth aage-peeche paida karta hai.

## animation-play-state, aur jo screen se bahar hai use pause karna

\`\`\`css
.spinner { animation-play-state: running; }
.spinner.paused { animation-play-state: paused; }
\`\`\`

\`\`\`js
const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    entry.target.classList.toggle('paused', !entry.isIntersecting);
  }
});
document.querySelectorAll('.spinner').forEach((el) => observer.observe(el));
\`\`\`

Aisa animation pause karna jo scroll hokar view se bahar chala gaya hai, aur wapas scroll hone par usse dobara shuru karna, kai alag-alag animate hote elements wale pages ke liye standard pattern hai — jahan koi dekh hi nahi sakta wahan chalta animation bina kisi dikhte fayde ke CPU aur battery ki barbaadi hai.

## Bhule hue infinite animation ki battery keemat

\`animation-iteration-count: infinite\` khud kabhi nahi rukta. DOM mein chhoda hua khatam ho chuka loading spinner, ya kisi component par decorative pulse jise user unmount kiye bina chhodkar chala gaya, compositor ko hamesha ke liye saqriya rakhta hai — ye seedha laptop ke energy usage aur phone ki battery drain mein dikhta hai, aur Chrome DevTools ka Performance panel ek aise tab ke liye lagatar compositor activity dikhayega jo siddhantik roop se idle hai.

## Animation ke sandarbh mein, khaas taur par prefers-reduced-motion

\`\`\`css
.hero-animation { animation: elaborate-entrance 1.2s ease-out; }

@media (prefers-reduced-motion: reduce) {
  .hero-animation { animation: none; }
  /* ya, kam kathor tarike se, poori tarah band karne ke bajaye chhota aur saada karo: */
  .hero-animation { animation-duration: 0.01ms; }
}
\`\`\`

Ye "slow connection wale users" ya "purane phone wale users" jaisa hi audience nahi hai — \`prefers-reduced-motion\` khaas taur par vestibular disorders, migraines, ya motion sensitivity wale logon ke liye hai, jinke liye bade parallax asar ya lambi entrance animations sach mein sharirik takleef paida kar sakti hain. Motion ki *maatra* kam karna ya band karna (zaruri nahi ki poora animation hataana) accessible default hai, aur is lesson mein jitni bhi animations hain unme se har ek ke liye reduced-motion wala jawab isse banate waqt hi socha jaana chahiye, baad mein jodne ke liye nahi.

## will-change — ek sanket, kam se kam istemaal

\`\`\`css
.panel { will-change: transform; }   /* sirf tab jab animate hone wala ho */
\`\`\`

\`will-change\` browser ko batata hai ki element ke liye pehle se ek alag compositor layer taiyaar kare, jo animation ke *pehle* frame ko smooth bana sakta hai. Ye muft nahi hai — extra GPU layers banana aur rakhna memory kharch karta hai — aur ise kai elements par lagana, ya animation khatam hone ke baad hataye bina hamesha ke liye chhod dena, performance ko behtar nahi, kharab kar sakta hai. Ye ek khaas, naape hue samasya (jhatakta pehla frame) ke liye auzaar hai, har jagah chhidak dene wala general-purpose performance switch nahi.`,

    examples: [
      {
        title: 'The forgotten infinite spinner',
        titleHi: 'Bhula hua infinite spinner',
        code: `@keyframes spin { to { transform: rotate(360deg); } }
.spinner { animation: spin 1s linear infinite; }
/* this element is left in the DOM long after loading finished */`,
        preview: page(`<div class="spin"></div>
<p style="font-size:13px;color:#666;margin-top:8px">This never stops on its own — imagine six of these left mounted on a dashboard after their data already loaded.</p>`,
`.spin { width:36px; height:36px; border:4px solid #dbeafe; border-top-color:#2563eb; border-radius:50%; animation:spin 1s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }`),
        previewHeight: 90,
        explain: '`infinite` genuinely never ends. If this element is never removed once its purpose is fulfilled, the compositor keeps animating it forever, invisible or not — this is the animation equivalent of forgetting to clear an interval.',
        explainHi: '\`infinite\` sach mein kabhi khatam nahi hota. Agar iska kaam poora hone ke baad ise hataya na jaye, to compositor use hamesha animate karta rehta hai, adrishya ho ya nahi — ye interval clear karna bhoolne jaisi hi galti hai, animation mein.',
      },
      {
        title: 'animation-fill-mode: forwards fixes the snap-back',
        titleHi: 'animation-fill-mode: forwards wapas kudna theek karta hai',
        code: `@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.a { animation: fadeIn 0.6s; }              /* snaps back after finishing */
.b { animation: fadeIn 0.6s forwards; }      /* stays visible */`,
        preview: page(`<button class="btn" onclick="[...document.querySelectorAll('.a,.b')].forEach(e=>{e.style.animation='none';e.offsetHeight;e.style.animation=null})">Replay</button>
<p class="a">Without forwards — watch closely, it may flash back to its original state right as the animation ends.</p>
<p class="b">With forwards — stays at opacity:1 after finishing.</p>`,
`.btn{padding:6px 12px;margin-bottom:8px}
.a{opacity:0.3;animation:fadeIn 1.5s;font-size:13px;background:#fee2e2;padding:8px}
.b{opacity:0.3;animation:fadeIn 1.5s forwards;font-size:13px;background:#dcfce7;padding:8px}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}`),
        previewHeight: 160,
        explain: 'Without `forwards`, the moment the animation completes, the element\'s opacity reverts to whatever its non-animated CSS says — here that base opacity was set to 0.3 to make the snap visible. `forwards` locks in the last keyframe instead.',
        explainHi: '\`forwards\` ke bina, animation poora hote hi element ki opacity uspar chali jati hai jo uski bina-animate wali CSS kehti hai — yahan wo base opacity 0.3 rakhi gayi hai taaki kudna dikhe. \`forwards\` iske bajaye aakhri keyframe ko lock kar deta hai.',
      },
      {
        title: 'Multi-waypoint keyframes: a pulse',
        titleHi: 'Multi-waypoint keyframes: ek pulse',
        code: `@keyframes pulse {
  0%   { transform: scale(1);    opacity: 1;   }
  50%  { transform: scale(1.15); opacity: 0.7; }
  100% { transform: scale(1);    opacity: 1;   }
}
.badge { animation: pulse 1.6s ease-in-out infinite; }`,
        preview: page(`<span class="badge">Live</span>`,
`.badge { display:inline-block; background:#dc2626; color:#fff; padding:4px 12px; border-radius:99px; font-size:12px; animation:pulse 1.6s ease-in-out infinite; }
@keyframes pulse { 0%{transform:scale(1);opacity:1} 50%{transform:scale(1.15);opacity:0.7} 100%{transform:scale(1);opacity:1} }`),
        previewHeight: 80,
        explain: 'Three waypoints, two properties each, and the browser smoothly interpolates every value between them. This is the standard "live" or "recording" indicator pattern seen across dashboards and streaming UIs.',
        explainHi: 'Teen waypoints, har ek mein do properties, aur browser inke beech har value ko smoothly interpolate karta hai. Ye dashboards aur streaming UIs mein dikhne wala standard "live" ya "recording" indicator pattern hai.',
      },
      {
        title: 'animation-direction: alternate',
        titleHi: 'animation-direction: alternate',
        code: `@keyframes bob { 0% { transform: translateY(0); } 100% { transform: translateY(-10px); } }
.el { animation: bob 0.7s ease-in-out infinite alternate; }`,
        preview: page(`<div class="b">↑↓</div>`,
`.b { width:40px; height:40px; background:#dbeafe; border:1px solid #60a5fa; display:flex; align-items:center; justify-content:center; animation:bob 0.7s ease-in-out infinite alternate; }
@keyframes bob { 0%{transform:translateY(0)} 100%{transform:translateY(-10px)} }`),
        previewHeight: 80,
        explain: 'Only one direction of motion was written in the keyframes, yet the element bobs smoothly up and down — `alternate` reverses playback on every other cycle instead of snapping back to 0% each time.',
        explainHi: 'Keyframes mein sirf ek disha ki motion likhi gayi thi, phir bhi element smoothly upar-neeche hota hai — \`alternate\` har doosre cycle mein playback ulta kar deta hai, har baar 0% par wapas kudne ke bajaye.',
      },
      {
        title: 'animation-play-state: paused when off-screen',
        titleHi: 'animation-play-state: screen se bahar hone par paused',
        code: `.spinner.paused { animation-play-state: paused; }
/* toggled by an IntersectionObserver when the element scrolls out of view */`,
        preview: page(`<button class="btn" onclick="document.querySelector('.spin').classList.toggle('paused')">Toggle (simulates scrolling off-screen)</button>
<div class="spin"></div>`,
`.btn{padding:6px 12px;margin-bottom:10px}
.spin { width:36px; height:36px; border:4px solid #dbeafe; border-top-color:#2563eb; border-radius:50%; animation:spin 1s linear infinite; }
.spin.paused { animation-play-state:paused; }
@keyframes spin { to { transform:rotate(360deg); } }`),
        previewHeight: 100,
        explain: 'The animation freezes exactly where it was, rather than resetting. In a real page this class is toggled by an IntersectionObserver, so animations scrolled out of the viewport stop consuming GPU cycles until they scroll back.',
        explainHi: 'Animation bilkul wahin jam jata hai jahan wo tha, reset hone ke bajaye. Asli page mein ye class ek IntersectionObserver se toggle hoti hai, isliye viewport se scroll hokar bahar gayi animations tab tak GPU cycles kharch karna band kar deti hain jab tak wo wapas scroll na hon.',
      },
      {
        title: 'Setting a fixed iteration count instead of infinite',
        titleHi: 'Infinite ke bajaye ek pakki iteration count',
        code: `.shake { animation: shake 0.4s ease-in-out 3; }   /* runs exactly 3 times, then stops */`,
        preview: page(`<button class="btn" onclick="const e=document.querySelector('.s');e.style.animation='none';e.offsetHeight;e.style.animation=null">Trigger error shake</button>
<div class="s">Invalid input</div>`,
`.btn{padding:6px 12px;margin-bottom:8px}
.s{animation:shake 0.4s ease-in-out 3;background:#fee2e2;color:#991b1b;padding:8px;font-size:13px;display:inline-block}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}`),
        previewHeight: 90,
        explain: 'A fixed number instead of `infinite` guarantees the animation actually finishes and stops consuming resources — appropriate for a one-off feedback effect like a form validation shake, where looping forever would make no sense anyway.',
        explainHi: '\`infinite\` ke bajaye ek pakki number ye pakka karta hai ki animation sach mein khatam ho aur resources kharch karna band kar de — form validation shake jaise ek-baar-ke feedback asar ke liye sahi, jahan hamesha loop karna waise bhi koi matlab na rakhta.',
      },
      {
        title: 'prefers-reduced-motion disables an elaborate entrance',
        titleHi: 'prefers-reduced-motion ek vistrit entrance ko band karta hai',
        code: `.hero { animation: swoop 1.2s ease-out; }
@media (prefers-reduced-motion: reduce) {
  .hero { animation: none; }
}`,
        preview: page(`<div class="hero">Hero content</div>
<p style="font-size:13px;color:#666;margin-top:8px">If your OS has "reduce motion" enabled, this appears instantly with no swooping animation — check your system accessibility settings.</p>`,
`.hero { animation:swoop 1.2s ease-out; background:#dbeafe; padding:16px; font-size:14px; }
@keyframes swoop { from{transform:translateX(-60px) rotate(-5deg);opacity:0} to{transform:none;opacity:1} }
@media (prefers-reduced-motion: reduce) { .hero { animation:none; } }`),
        previewHeight: 110,
        explain: 'A large sweeping entrance is exactly the kind of motion that can cause real discomfort for users with vestibular sensitivity. The media query removes the effect entirely for them while everyone else still sees the full animation.',
        explainHi: 'Ek badi jhaadu-jaisi entrance bilkul waisi motion hai jo vestibular sensitivity wale users ke liye sach mein takleef paida kar sakti hai. Media query unke liye asar poori tarah hata deta hai jabki baaki sab ko poora animation dikhta rehta hai.',
      },
      {
        title: 'A lighter reduced-motion response than full removal',
        titleHi: 'Poori tarah hataane se halka reduced-motion jawab',
        code: `@media (prefers-reduced-motion: reduce) {
  .card { animation-duration: 0.01ms !important; }
}`,
        preview: page(`<div class="note">
  Some teams prefer shortening every animation to near-zero duration rather than removing it entirely with <code>animation: none</code> — the state still changes (so nothing looks "broken" or stuck mid-transition), it simply happens without perceptible motion.
</div>`,
`.note { font-size:13px; background:#f0fdf4; border:1px solid #10b981; padding:10px; border-radius:4px; }`),
        previewHeight: 130,
        explain: 'Both approaches are valid accessible responses. Fully removing the animation is simpler; collapsing the duration keeps any state changes the animation was responsible for (like revealing content) while removing only the perceptible motion.',
        explainHi: 'Dono tarike valid accessible jawab hain. Animation poori tarah hataana zyada saada hai; duration ko sikoud dena kisi bhi state change ko rakhta hai jiske liye animation zimmedar tha (jaise content dikhaana), sirf mehsoos hoti motion ko hataate hue.',
      },
      {
        title: 'will-change before an animation, removed after',
        titleHi: 'Animation se pehle will-change, baad mein hataya hua',
        code: `.panel:hover { will-change: transform; }   /* hint applied only while relevant */
.panel { transition: transform 0.3s; }
.panel:hover { transform: translateY(-4px); }`,
        preview: page(`<div class="p">Hover me</div>
<p style="font-size:13px;color:#666;margin-top:8px">will-change is applied via :hover here, so the browser only holds the extra compositor layer while it's actually about to be needed — not permanently.</p>`,
`.p { width:140px; padding:16px; background:#dbeafe; text-align:center; font-size:13px; transition:transform 0.3s; }
.p:hover { will-change:transform; transform:translateY(-4px); }`),
        previewHeight: 130,
        explain: 'Scoping `will-change` to the moment it is needed — here, only during `:hover` — avoids permanently reserving GPU memory for a layer that is idle most of the time. Applying it unconditionally to every card on a page is a common overuse mistake.',
        explainHi: '\`will-change\` ko sirf zarurat ke pal tak seemit karna — yahan, sirf \`:hover\` ke dauran — ek aisi layer ke liye hamesha GPU memory rokne se bachata hai jo zyadatar samay idle rehti hai. Ise page ke har card par bina shart lagana ek aam overuse ki galti hai.',
      },
      {
        title: 'A finished loading state removes its own animation',
        titleHi: 'Khatam ho chuki loading state apna animation khud hataata hai',
        code: `spinner.remove();   // or unmount the component — do not just hide it with display:none while it keeps animating`,
        preview: page(`<button class="btn" onclick="document.querySelector('.spin').remove(); document.querySelector('.done').style.display='block'">Simulate load finishing</button>
<div class="spin"></div>
<div class="done" style="display:none;font-size:13px;color:#166534">Loaded — the spinner element is gone from the DOM, not just hidden. No animation is running anymore.</div>`,
`.btn{padding:6px 12px;margin-bottom:10px}
.spin { width:32px; height:32px; border:4px solid #dbeafe; border-top-color:#2563eb; border-radius:50%; animation:spin 1s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }`),
        previewHeight: 110,
        explain: 'Note the distinction: `display: none` alone still leaves the animation technically running in some browsers, and definitely leaves the element in the DOM taking up JavaScript memory. Fully removing it is the safest way to guarantee the CPU cost actually stops.',
        explainHi: 'Fark dhyan do: akela \`display: none\` kuch browsers mein animation ko technically chalta chhod deta hai, aur element ko pakka DOM mein rakhta hai jo JavaScript memory leta hai. Use poori tarah hataana ye pakka karne ka sabse surakshit tarika hai ki CPU keemat sach mein ruk jaye.',
      },
    ],

    mistakes: [
      {
        wrong: `.spinner { animation: spin 1s linear infinite; }
/* left mounted in the DOM after loading finishes */`,
        right: `// remove or unmount the spinner element once loading completes
spinnerEl.remove();`,
        why: '`infinite` never stops on its own. An animation left running after its purpose is fulfilled keeps the compositor active and drains battery for zero visible benefit — treat ending an infinite animation with the same discipline as clearing a setInterval.',
        whyHi: '\`infinite\` khud kabhi nahi rukta. Apna kaam poora hone ke baad chalta chhoda hua animation compositor ko saqriya rakhta hai aur bina kisi dikhte fayde ke battery kharch karta hai — infinite animation khatam karne ko \`setInterval\` clear karne jaisi hi anushasan se lo.',
      },
      {
        wrong: `@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.el { animation: fadeIn 0.4s; }   /* snaps back to original opacity after finishing */`,
        right: `.el { animation: fadeIn 0.4s forwards; }`,
        previewWrong: page(`<p class="a">Snaps back</p>`, `.a{opacity:0.3;animation:f 1.2s;font-size:13px}@keyframes f{from{opacity:0}to{opacity:1}}`),
        previewRight: page(`<p class="a">Stays visible</p>`, `.a{opacity:0.3;animation:f 1.2s forwards;font-size:13px}@keyframes f{from{opacity:0}to{opacity:1}}`),
        previewHeight: 90,
        why: 'Without `animation-fill-mode: forwards`, the element reverts to its non-animated CSS the instant the animation completes, undoing the visible effect you just built — the final keyframe does not persist by default.',
        whyHi: '\`animation-fill-mode: forwards\` ke bina, element animation poora hote hi apni bina-animate wali CSS par wapas chala jata hai, jisse aapne abhi banaya dikhta asar mit jata hai — default roop se aakhri keyframe bani nahi rehti.',
      },
      {
        wrong: `.hero { animation: elaborate-swoop 1.5s ease-out; }
/* no reduced-motion handling anywhere in the stylesheet */`,
        right: `.hero { animation: elaborate-swoop 1.5s ease-out; }
@media (prefers-reduced-motion: reduce) { .hero { animation: none; } }`,
        why: 'Large-scale motion can cause genuine physical discomfort for users with vestibular disorders, not just cosmetic annoyance. Every animation, especially large sweeping ones, should have a reduced-motion counterpart considered from the start.',
        whyHi: 'Bade paimane ki motion vestibular disorders wale users ke liye sach mein sharirik takleef paida kar sakti hai, sirf dikhne wali pareshaani nahi. Har animation, khaas taur par badi jhaadu-jaisi wali, ka reduced-motion jawab shuruaat se hi socha jaana chahiye.',
      },
      {
        wrong: `* { will-change: transform, opacity; }   /* applied to everything, permanently */`,
        right: `.panel:hover { will-change: transform; }   /* scoped to only when it's actually about to animate */`,
        why: 'will-change reserves an extra GPU compositor layer for every matched element. Applying it broadly and permanently, rather than scoping it to the moment before an animation starts, wastes memory and can make performance worse rather than better.',
        whyHi: 'will-change matching hue har element ke liye ek extra GPU compositor layer rokta hai. Ise widely aur hamesha ke liye lagana, animation shuru hone se theek pehle tak seemit karne ke bajaye, memory barbaad karta hai aur performance behtar ke bajaye kharab kar sakta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Battery and energy profiling in devtools.** Chrome\'s Performance panel and macOS Activity Monitor\'s "Energy Impact" column both directly surface tabs with forgotten infinite animations as top energy consumers — this is a real, measured category of bug, not a theoretical concern.',
        hi: '**Devtools mein battery aur energy profiling.** Chrome ka Performance panel aur macOS Activity Monitor ka "Energy Impact" column dono bhoole hue infinite animations wale tabs ko seedha top energy consumers ki tarah dikhate hain — ye ek asli, naapa jaane wala bug ki category hai, koi siddhantik chinta nahi.',
      },
      {
        en: '**Skeleton loaders and shimmer effects.** The pulsing "shimmer" placeholder shown while content loads (LinkedIn, YouTube, most modern dashboards) is a `@keyframes` animation that must be removed the instant real content arrives — the exact discipline this lesson is built around.',
        hi: '**Skeleton loaders aur shimmer effects.** Content load hote waqt dikhne wala dhadakta "shimmer" placeholder (LinkedIn, YouTube, zyadatar modern dashboards) ek \`@keyframes\` animation hai jise asli content aate hi hataana zaruri hai — bilkul wahi anushasan jispar ye lesson bana hai.',
      },
      {
        en: '**WCAG 2.3.3 (Animation from Interactions).** Accessibility guidelines specifically require that motion triggered by interaction can be disabled, and `prefers-reduced-motion` is the standard mechanism browsers and design systems use to satisfy that requirement automatically.',
        hi: '**WCAG 2.3.3 (Animation from Interactions).** Accessibility guidelines khaas taur par yeh zaroori maanti hain ki interaction se trigger hone wali motion band ki ja sake, aur \`prefers-reduced-motion\` wo standard tarika hai jise browsers aur design systems us zarurat ko apne aap poora karne ke liye use karte hain.',
      },
    ],

    interviewQA: [
      {
        q: 'What does `animation-fill-mode: forwards` do, and why is it so commonly needed?',
        qHi: '\`animation-fill-mode: forwards\` kya karta hai, aur ye itna aam kyun chahiye hota hai?',
        a: 'By default, once a `@keyframes` animation completes, the element\'s computed style reverts to what it would be without the animation — the final keyframe\'s values do not persist. `animation-fill-mode: forwards` changes this so the element keeps the styling from the last keyframe after the animation ends. It is needed constantly because almost any "appear" animation — a fade-in, a slide-in — is meant to leave the element in its final visible state, and without `forwards` it snaps back to invisible or off-screen the instant the animation finishes, which looks like the animation simply failed.',
        aHi: 'Default roop se, ek \`@keyframes\` animation poora hote hi, element ki computed style waisi ho jati hai jaisi wo bina animation ke hoti — aakhri keyframe ki values bani nahi rehti. \`animation-fill-mode: forwards\` ise badal deta hai taaki element animation khatam hone ke baad aakhri keyframe ki styling rakh le. Ye lagatar zaruri hota hai kyunki lagbhag har "appear" animation — fade-in, slide-in — ka matlab hai element ko uski aakhri dikhti sthiti mein chhodna, aur \`forwards\` ke bina wo animation khatam hote hi adrishya ya screen se bahar wapas kud jata hai, jo aisa dikhta hai jaise animation bas fail ho gaya.',
      },
      {
        q: 'Why is an infinite CSS animation a potential performance and battery problem, and how should it be managed?',
        qHi: 'Infinite CSS animation kaise performance aur battery ki samasya ban sakta hai, aur use kaise sambhalna chahiye?',
        a: '`animation-iteration-count: infinite` never stops on its own, so if the element it is applied to is left in the DOM after its purpose is fulfilled — a spinner after data has loaded, a decorative effect on a component nobody navigated away from cleanly — the compositor keeps doing work for it indefinitely, consuming CPU and battery with no visible benefit. It should be managed the same way as any other never-ending resource: remove or unmount the element once it is no longer needed, and additionally use `animation-play-state: paused`, often driven by an IntersectionObserver, to pause any animation that has scrolled out of the viewport.',
        aHi: '\`animation-iteration-count: infinite\` khud kabhi nahi rukta, isliye agar jis element par ye lagaya gaya hai wo apna kaam poora hone ke baad DOM mein chhoda reh jaye — data load hone ke baad ek spinner, kisi aise component par decorative asar jise saaf tarike se unmount nahi kiya gaya — compositor uske liye hamesha kaam karta rehta hai, bina kisi dikhte fayde ke CPU aur battery kharch karte hue. Ise kisi bhi doosre kabhi-na-khatam-hone-wale resource ki tarah hi sambhalna chahiye: zarurat khatam hote hi element ko hataao ya unmount karo, aur iske alawa \`animation-play-state: paused\` use karo, jo aksar IntersectionObserver se chalta hai, taaki jo bhi animation viewport se scroll hokar bahar chali gayi ho use pause kiya ja sake.',
      },
      {
        q: 'What is `prefers-reduced-motion`, and why is it specifically relevant to animation, not just responsive layout?',
        qHi: '\`prefers-reduced-motion\` kya hai, aur ye khaas taur par animation ke liye relevant kyun hai, sirf responsive layout ke liye nahi?',
        a: '`prefers-reduced-motion` reads an operating-system-level accessibility setting the user has explicitly turned on. It exists because large-scale or fast motion — parallax scrolling, sweeping entrance animations, aggressive keyframe effects — can cause real physical symptoms like dizziness or nausea for users with vestibular disorders, not just visual distraction. Every animation with meaningful motion should have a `@media (prefers-reduced-motion: reduce)` counterpart that either removes the animation or collapses its perceptible motion, considered as part of building the effect rather than added afterward as an afterthought.',
        aHi: '\`prefers-reduced-motion\` ek operating-system-level accessibility setting padhta hai jise user ne khud jaan-boojh kar on ki hai. Ye isliye maujood hai ki bada paimana ya tez motion — parallax scrolling, lambi entrance animations, aggressive keyframe asar — vestibular disorders wale users ke liye chakkar ya jee michlane jaise sach mein sharirik lakshan paida kar sakti hai, sirf drishya vichalan nahi. Kisi bhi matlab wali motion wale har animation ke saath ek \`@media (prefers-reduced-motion: reduce)\` jawab hona chahiye jo ya to animation hataye ya uski mehsoos hoti motion sikoud de, jo asar banate waqt hi socha jaye, baad mein afterthought ki tarah nahi jodi jaye.',
      },
      {
        q: 'What is `will-change` for, and why should it be used sparingly?',
        qHi: '\`will-change\` kis ke liye hai, aur use kam se kam kyun use karna chahiye?',
        a: '`will-change` hints to the browser that an element is about to be animated, letting it prepare a dedicated compositor layer in advance, which can smooth out the very first frame of the animation. The cost is that each such layer consumes GPU memory, and creating too many, or leaving `will-change` applied permanently rather than scoping it to just before the animation starts, can degrade performance instead of improving it. It should be reserved for a specific, measured problem — a janky first frame — not applied broadly as a general optimisation.',
        aHi: '\`will-change\` browser ko sanket deta hai ki ek element abhi animate hone wala hai, jisse wo pehle se ek alag compositor layer taiyaar kar sake, jo animation ke bilkul pehle frame ko smooth bana sakta hai. Iski keemat ye hai ki har aisi layer GPU memory kharch karti hai, aur bahut zyada banana, ya \`will-change\` ko hamesha ke liye lagaye rakhna animation shuru hone se theek pehle tak seemit karne ke bajaye, performance ko behtar karne ke bajaye kharab kar sakta hai. Ise ek khaas, naape hue samasya (jhatakta pehla frame) ke liye rakhna chahiye, ek aam optimisation ki tarah widely lagane ke liye nahi.',
      },
      {
        q: 'What is the difference between `animation-direction: alternate` and writing the reverse motion manually into the keyframes?',
        qHi: '\`animation-direction: alternate\` aur reverse motion ko haath se keyframes mein likhne mein kya fark hai?',
        a: '`alternate` reverses the playback direction on every other iteration automatically — the animation plays the defined keyframes forward, then backward, then forward again — without needing the keyframes themselves to describe the return trip. Writing the reverse motion manually would mean duplicating waypoints in reverse order inside the same `@keyframes` block, which is more code, harder to keep in sync if the forward motion changes, and produces the exact same visual result `alternate` gives for free.',
        aHi: '\`alternate\` apne aap har doosri iteration par playback ki disha ulti kar deta hai — animation define ki hui keyframes ko aage chalata hai, phir peeche, phir aage — bina keyframes ko khud wapas jaane ka safar bataye. Reverse motion haath se likhne ka matlab hoga usi \`@keyframes\` block ke andar ulte kram mein waypoints ko dohrana, jo zyada code hai, aage ki motion badalne par sync mein rakhna mushkil hai, aur bilkul wahi drishya nateeja deta hai jo \`alternate\` muft mein deta hai.',
      },
    ],

    exercises: [
      {
        task: 'Build a loading spinner with `animation: spin 1s linear infinite`. Open Chrome DevTools\' Performance Monitor and observe CPU usage while it runs, then remove the element from the DOM and observe it drop.',
        taskHi: '\`animation: spin 1s linear infinite\` wala loading spinner banao. Chrome DevTools ka Performance Monitor kholo aur chalte waqt CPU usage dekho, phir element ko DOM se hataao aur dekho wo gir jata hai.',
        hint: 'DevTools > More tools > Performance monitor gives a live CPU graph you can watch change in real time.',
        hintHi: 'DevTools > More tools > Performance monitor ek live CPU graph deta hai jise aap real time mein badalte hue dekh sakte ho.',
      },
      {
        task: 'Build a fade-in animation without `animation-fill-mode: forwards`, trigger it, and confirm the element snaps back to its original state. Add `forwards` and confirm it stays.',
        taskHi: '\`animation-fill-mode: forwards\` ke bina ek fade-in animation banao, use trigger karo, aur confirm karo ki element apni asli sthiti mein wapas kudta hai. \`forwards\` jodo aur confirm karo ki wo tik jata hai.',
        hint: 'Set the element\'s base (non-animated) opacity to something visibly different from the animation\'s end state to make the snap-back obvious.',
        hintHi: 'Element ki base (bina-animate wali) opacity ko animation ki aakhri sthiti se saaf alag rakho taaki wapas kudna dikhaai de.',
      },
      {
        task: 'Add `prefers-reduced-motion` handling to any animation you have built so far in this course, and test it by toggling the "reduce motion" setting in your OS accessibility settings.',
        taskHi: 'Is course mein ab tak banaye kisi bhi animation mein \`prefers-reduced-motion\` handling jodo, aur apne OS accessibility settings mein "reduce motion" setting toggle karke test karo.',
        hint: 'macOS: System Settings > Accessibility > Display > Reduce motion. Windows: Settings > Accessibility > Visual effects > Animation effects.',
        hintHi: 'macOS: System Settings > Accessibility > Display > Reduce motion. Windows: Settings > Accessibility > Visual effects > Animation effects.',
      },
    ],

    keyTakeaways: [
      '`@keyframes` waypoints are percentages the browser interpolates between; `from`/`to` are aliases for 0%/100%.',
      'Without `animation-fill-mode: forwards`, an element reverts to its non-animated style the instant the animation ends.',
      '`animation-iteration-count: infinite` never stops on its own — treat ending it with the same discipline as clearing a setInterval.',
      '`animation-play-state: paused`, often driven by an IntersectionObserver, stops off-screen animations from wasting CPU and battery.',
      'Every animation with meaningful motion needs a `prefers-reduced-motion` counterpart — this serves a real accessibility need, not a cosmetic preference.',
      '`will-change` smooths a janky first frame but costs GPU memory — scope it to just before the animation starts, not permanently or broadly.',
    ],
    keyTakeawaysHi: [
      '\`@keyframes\` waypoints percentages hain jinke beech browser interpolate karta hai; \`from\`/\`to\` 0%/100% ke alias hain.',
      '\`animation-fill-mode: forwards\` ke bina, element animation khatam hote hi apni bina-animate wali style par wapas chala jata hai.',
      '\`animation-iteration-count: infinite\` khud kabhi nahi rukta — ise khatam karne ko \`setInterval\` clear karne jaisi hi anushasan se lo.',
      '\`animation-play-state: paused\`, jo aksar IntersectionObserver se chalta hai, screen se bahar wali animations ko CPU aur battery barbaad karne se rokta hai.',
      'Kisi bhi matlab wali motion wale har animation ko \`prefers-reduced-motion\` jawab chahiye — ye ek asli accessibility zarurat ko poora karta hai, dikhne wali pasand nahi.',
      '\`will-change\` jhatakta pehla frame smooth karta hai par GPU memory kharch karta hai — ise animation shuru hone se theek pehle tak seemit rakho, hamesha ke liye ya widely nahi.',
    ],
  },
];
