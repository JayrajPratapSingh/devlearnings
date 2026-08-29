/**
 * CSS & HTML Complete Course — Module 5 (Motion), lesson 1.
 *
 * Transitions and transforms. The broken example animates `left`, which
 * looks fine in isolation and stutters the moment the page has real content
 * around it — because it re-triggers layout on every frame. This lesson
 * exists to make that distinction (layout properties vs. compositor
 * properties) concrete before Module 5's second lesson covers keyframes
 * and the 60fps budget in full.
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

export const CSS_MODULE_5: CourseLesson[] = [
  {
    slug: 'css-transitions-transforms',
    title: 'Transitions and Transforms',
    titleHi: 'Transitions aur Transforms',
    description: 'A sliding panel that stutters on a cheap phone and glides on your laptop. Same CSS, different property.',
    descriptionHi: 'Ek sarakta panel jo sasste phone par atakta hai aur laptop par pheesalta hai. Wahi CSS, alag property.',
    difficulty: 'MEDIUM',
    duration: 34,
    order: 1,

    analogy: {
      en: '**Rearranging furniture versus moving a photograph on the wall.** Changing `left` is rearranging furniture — every neighbour has to be re-measured to see if it still fits, over and over, sixty times a second. Changing `transform` is sliding a photograph that is already hanging on the wall — nothing else in the room needs to know or care, because the photograph was already handed to a separate layer that moves independently. Both end up in the same place. Only one makes the room recalculate itself on every frame.',
      hi: '**Furniture rearrange karna aur diwar par lagi photo hilaana.** `left` badalna furniture rearrange karna hai — har padosi ko baar-baar, saath second mein saath baar naapna padta hai ki wo phir bhi fit hota hai ya nahi. `transform` badalna ek photo sarkaana hai jo pehle se diwar par tangi hai — kamre mein kisi aur ko na pata chalta hai na fark padta hai, kyunki photo pehle se ek alag layer ko de di gayi thi jo khud hilti hai. Dono aakhir mein ek hi jagah pahunchte hain. Sirf ek kamre ko har frame par khud ko dobara ganit karne par majboor karta hai.',
    },

    simple: `**Start broken.** A slide-in panel:

\`\`\`css
.panel { position: absolute; left: -300px; transition: left 0.3s; }
.panel.open { left: 0; }
\`\`\`

On a fast laptop this looks fine. On an actual mid-range phone, or on a laptop with a busy page around it, it visibly stutters — the motion is not smooth, it judders.

**Why:** \`left\` is a **layout** property. Changing it forces the browser to recompute the position and size of the panel, and potentially every element affected by it, and then repaint the affected pixels — and it has to do this **on every single animation frame**, up to 60 times a second, for the whole 0.3 seconds. On a busy page, or a slower device, the browser cannot always finish that work inside the ~16.7ms budget one frame gets, and frames get dropped. Dropped frames are what "stutter" actually is.

**The fix: animate \`transform\` instead**

\`\`\`css
.panel { transform: translateX(-300px); transition: transform 0.3s; }
.panel.open { transform: translateX(0); }
\`\`\`

Same visual result. Completely different cost. \`transform\` does not affect layout at all — the browser can move the already-painted panel on the **compositor**, a separate step that happens on the GPU, without recalculating anything else on the page. This is why "prefer \`transform\` and \`opacity\` for animation" is close to a hard rule in professional CSS, not a style preference.

**The three properties that are (almost) always safe to animate**

\`\`\`css
transform: translateX(20px) scale(1.1) rotate(5deg);
opacity: 0.5;
filter: blur(2px);
\`\`\`

These three can be handled by the compositor alone. Nearly everything else — \`width\`, \`height\`, \`top\`, \`left\`, \`margin\`, \`padding\` — triggers layout, and animating them risks the stutter you just saw.

**The transition shorthand**

\`\`\`css
transition: transform 0.3s ease-in-out;
/*          property   duration  easing */
\`\`\`

Without a duration, \`transition\` does nothing visible — the change still happens, just instantly. The easing curve shapes *how* the value moves between start and end, not just how long it takes.

**Remember:** if it can be written as a \`transform\`, write it as a \`transform\` — not because it is more "modern", but because it is the difference between a smooth animation and a stuttering one on a real device.`,

    simpleHi: `**Toote hue se shuru.** Ek slide-in panel:

\`\`\`css
.panel { position: absolute; left: -300px; transition: left 0.3s; }
.panel.open { left: 0; }
\`\`\`

Tez laptop par ye theek lagta hai. Asli mid-range phone par, ya vyast page wale laptop par, ye dikhne mein atakta hai — motion smooth nahi hoti, jhatakti hai.

**Kyun:** \`left\` ek **layout** property hai. Ise badalne se browser ko panel ki jagah aur size dobara ganit karna padta hai, aur ho sakta hai iske saath judi har cheez ka bhi, aur phir asar hue pixels ko dobara paint karna padta hai — aur ye kaam use **har ek animation frame par** karna padta hai, poore 0.3 second tak, 60 baar tak har second. Vyast page par, ya dheeme device par, browser hamesha ye kaam ek frame ke lagbhag 16.7ms ke budget ke andar poora nahi kar pata, aur frames chhoot jate hain. Chhoote hue frames hi "stutter" hote hain.

**Fix: iske bajaye \`transform\` animate karo**

\`\`\`css
.panel { transform: translateX(-300px); transition: transform 0.3s; }
.panel.open { transform: translateX(0); }
\`\`\`

Wahi drishya nateeja. Bilkul alag keemat. \`transform\` layout ko bilkul asar nahi karta — browser pehle se painted panel ko **compositor** par hila sakta hai, ek alag step jo GPU par hota hai, page par kuch aur dobara ganit kiye bina. Isiliye professional CSS mein "animation ke liye \`transform\` aur \`opacity\` pasand karo" ek style ki pasand nahi, lagbhag ek pakka niyam hai.

**Teen properties jo (lagbhag) hamesha animate karne ke liye surakshit hain**

\`\`\`css
transform: translateX(20px) scale(1.1) rotate(5deg);
opacity: 0.5;
filter: blur(2px);
\`\`\`

Ye teen akele compositor sambhal sakta hai. Lagbhag baaki sab kuch — \`width\`, \`height\`, \`top\`, \`left\`, \`margin\`, \`padding\` — layout trigger karta hai, aur inhe animate karne mein wahi stutter ka khatra hai jo aapne abhi dekha.

**Transition shorthand**

\`\`\`css
transition: transform 0.3s ease-in-out;
/*          property   duration  easing */
\`\`\`

Bina duration ke, \`transition\` kuch dikhta hua nahi karta — badlav phir bhi hota hai, bas turant. Easing curve shape karta hai ki value shuru se aakhir tak *kaise* chalti hai, sirf ye nahi ki kitni der lagti hai.

**Yaad rakho:** agar wo \`transform\` ki tarah likha ja sakta hai, to use \`transform\` ki tarah likho — isliye nahi ki ye zyada "modern" hai, balki isliye ki ye asli device par smooth animation aur atakti hui animation ke beech ka fark hai.`,

    content: `## The layout / paint / composite pipeline, briefly

Every visual change goes through up to three stages:

\`\`\`
1. Layout    — recalculate size and position of elements ("reflow")
2. Paint     — redraw pixels into layers
3. Composite — combine layers on the GPU and display them
\`\`\`

Changing a property can trigger all three, just the last two, or only the last one, depending on what the property affects:

\`\`\`
top, left, width, height, margin, padding, font-size   → Layout + Paint + Composite   (expensive)
background-color, box-shadow, border-color             → Paint + Composite            (medium)
transform, opacity, filter                              → Composite only               (cheap)
\`\`\`

\`transform\` and \`opacity\` skip layout and paint entirely once the element is already rendered — the browser can hand the already-painted layer to the GPU and let it interpolate the transform matrix or the alpha value on its own, frame after frame, without ever asking the CSS layout engine a question.

## The 60fps budget

A screen refreshing at 60Hz gives the browser **16.7 milliseconds** per frame to do all of its work — layout, paint, composite, plus any JavaScript — before that frame must be shown. Miss the budget and the frame is dropped or delayed, which is felt as stutter or jank. This is why a \`left\` transition that looks smooth on an idle desktop page can visibly stutter once real content, other animations, or a slower device are in the picture: there is simply more competing for that same 16.7ms window, and a layout-triggering animation is the first thing to get squeezed out.

## transform in full

\`\`\`css
transform: translateX(20px);          /* move horizontally */
transform: translateY(-10px);         /* move vertically */
transform: translate(20px, -10px);    /* both at once */
transform: scale(1.2);                /* 120% size, both axes */
transform: scale(1.2, 0.9);           /* different per axis */
transform: rotate(15deg);
transform: skew(10deg, 0deg);
transform: translateX(20px) rotate(15deg) scale(1.1);  /* combined, applied in order */
\`\`\`

Multiple transform functions in one declaration apply in the order written — \`translate\` then \`rotate\` is not the same result as \`rotate\` then \`translate\`, because each subsequent function operates in the coordinate system left behind by the one before it.

\`\`\`css
transform-origin: center;    /* default — rotation/scale pivot around the element's centre */
transform-origin: top left;  /* pivot around a corner instead */
\`\`\`

## The transition shorthand, fully expanded

\`\`\`css
transition-property: transform;
transition-duration: 0.3s;
transition-timing-function: ease-in-out;
transition-delay: 0s;

/* shorthand, same order: */
transition: transform 0.3s ease-in-out 0s;

/* multiple properties, independently timed: */
transition: transform 0.3s ease-out, opacity 0.5s linear;

/* or animate everything that changes (convenient, but imprecise) */
transition: all 0.3s;
\`\`\`

\`transition: all\` is a common shortcut, but it also transitions properties you may not have intended to animate — including ones you add later without remembering this rule exists. Naming properties explicitly is more verbose but keeps the intent visible and avoids surprise animations.

## Timing functions

\`\`\`css
linear         constant speed throughout
ease           slow start, fast middle, slow end (the default, and usually the right choice)
ease-in        slow start, then speeds up — good for things LEAVING the screen
ease-out       starts fast, slows to a stop — good for things ENTERING the screen
ease-in-out    slow at both ends
cubic-bezier(0.25, 0.1, 0.25, 1)   a custom curve, four control-point numbers
\`\`\`

\`ease-out\` reads as more natural for anything appearing or arriving, because real-world motion — a ball landing, a hand placing an object down — decelerates on arrival rather than stopping abruptly.

## What actually happens when you change \`left\` mid-transition

The browser must, on every frame: recompute the panel's box (layout), recompute anything whose layout depends on the panel's position or size, repaint the pixels that changed, then composite the result. If any sibling uses percentage widths, flex growth, or is otherwise entangled with the panel's box, the layout recalculation can cascade well beyond the one element you meant to move — which is part of why layout-triggering animations get *more* expensive, not less, as a page grows more complex.`,

    contentHi: `## Layout / paint / composite pipeline, sankshep mein

Har drishya badlav teen tak stages se guzarta hai:

\`\`\`
1. Layout    — elements ka size aur position dobara ganit karna ("reflow")
2. Paint     — pixels ko layers mein dobara khinchna
3. Composite — layers ko GPU par jodna aur dikhaana
\`\`\`

Kisi property ko badalne se teenon, sirf aakhri do, ya sirf aakhri ek trigger ho sakta hai, is baat par nirbhar karta hai ki wo property kya asar karti hai:

\`\`\`
top, left, width, height, margin, padding, font-size   → Layout + Paint + Composite   (mehenga)
background-color, box-shadow, border-color             → Paint + Composite            (madhyam)
transform, opacity, filter                              → sirf Composite               (sasta)
\`\`\`

\`transform\` aur \`opacity\` element pehle se render hone ke baad layout aur paint dono bilkul chhod dete hain — browser pehle se painted layer GPU ko de sakta hai aur use transform matrix ya alpha value khud, frame-dar-frame, CSS layout engine se kuch pooche bina interpolate karne de sakta hai.

## 60fps ka budget

60Hz par refresh hoti screen browser ko har frame ke liye **16.7 milliseconds** deti hai apna sara kaam karne ke liye — layout, paint, composite, plus koi bhi JavaScript — us frame ko dikhaye jaane se pehle. Budget chook jao to frame chhoot jata hai ya der se dikhta hai, jo stutter ya jank ki tarah mehsoos hota hai. Isiliye ek \`left\` transition jo khaali desktop page par smooth lagta hai, asli content, doosre animations, ya dheeme device ke saath saaf atak sakta hai: usi 16.7ms window ke liye zyada competition hoti hai, aur layout-trigger karne wala animation sabse pehle dabaya jata hai.

## transform poore roop mein

\`\`\`css
transform: translateX(20px);          /* leti taraf hilana */
transform: translateY(-10px);         /* khadi taraf hilana */
transform: translate(20px, -10px);    /* dono ek saath */
transform: scale(1.2);                /* 120% size, dono axes */
transform: scale(1.2, 0.9);           /* har axis ke liye alag */
transform: rotate(15deg);
transform: skew(10deg, 0deg);
transform: translateX(20px) rotate(15deg) scale(1.1);  /* mila hua, kram se lagta hai */
\`\`\`

Ek declaration mein kai transform functions likhe hue kram mein lagte hain — \`translate\` phir \`rotate\` wahi nateeja nahi deta jo \`rotate\` phir \`translate\` deta hai, kyunki har agla function us coordinate system mein kaam karta hai jo pichhle ne chhoda tha.

\`\`\`css
transform-origin: center;    /* default — rotation/scale element ke center ke aas-paas pivot karta hai */
transform-origin: top left;  /* iske bajaye ek corner ke aas-paas pivot */
\`\`\`

## Transition shorthand, poora khula hua

\`\`\`css
transition-property: transform;
transition-duration: 0.3s;
transition-timing-function: ease-in-out;
transition-delay: 0s;

/* shorthand, wahi kram: */
transition: transform 0.3s ease-in-out 0s;

/* kai properties, alag-alag samay ki: */
transition: transform 0.3s ease-out, opacity 0.5s linear;

/* ya jo bhi badle sab animate karo (aasan, par imprecise) */
transition: all 0.3s;
\`\`\`

\`transition: all\` ek aam jugaad hai, par ye un properties ko bhi transition karta hai jo aapne shayad animate karne ka socha hi nahi tha — un sameet jo aap baad mein jodte ho bina ye niyam yaad rakhe. Properties ko seedha naam se likhna zyada verbose hai par irade ko dikhta rakhta hai aur achanak animations se bachata hai.

## Timing functions

\`\`\`css
linear         poori tarah barabar raftaar
ease           dheeme se shuru, tez beech, dheema ant (default, aur aksar sahi chunaav)
ease-in        dheeme se shuru, phir tez ho jata hai — screen se JAANE waali cheezon ke liye achha
ease-out       tez shuru hota hai, ruk ne tak dheema hota hai — screen mein AANE waali cheezon ke liye achha
ease-in-out    dono kinaron par dheema
cubic-bezier(0.25, 0.1, 0.25, 1)   ek custom curve, chaar control-point numbers
\`\`\`

\`ease-out\` kisi bhi aane ya pahunchne wali cheez ke liye zyada svaabhavik lagta hai, kyunki asli duniya ki motion — girti hui gend, rakha jata hua haath — pahunchte waqt achanak rukne ke bajaye dheemi hoti hai.

## Transition ke beech \`left\` badalne par asal mein kya hota hai

Har frame par browser ko karna padta hai: panel ke box ka dobara ganit (layout), aur kuch bhi jiska layout panel ki jagah ya size par nirbhar hai uska dobara ganit, phir badle hue pixels ka dobara paint, phir nateeje ka composite. Agar koi bhai-behan percentage widths use karta hai, flex grow karta hai, ya kisi aur tarah panel ke box se juda hai, to layout ka dobara ganit us ek element se kaafi aage tak failt sakta hai jise aap hilaana chahte the — yahi ek wajah hai ki layout-trigger karne wale animations page complex hote hi *kam* nahi, *zyada* mehenge ho jate hain.`,

    examples: [
      {
        title: 'The stutter: animating left',
        titleHi: 'Stutter: left ko animate karna',
        code: `.panel { position: absolute; left: -260px; transition: left 0.4s; }
.panel.open { left: 0; }`,
        preview: page(`<div class="wrap">
  <div class="panel open">left: -260px &rarr; 0. On a real device with a busy page, this triggers layout on every frame.</div>
</div>
<button class="btn" onclick="document.querySelector('.panel').classList.toggle('open')">Toggle</button>`,
`.wrap { position:relative; height:70px; overflow:hidden; border:2px dashed #94a3b8; }
.panel { position:absolute; left:-260px; top:0; width:240px; height:70px; background:#fecaca; border:1px solid #ef4444; padding:8px; font-size:12px; transition:left 0.4s; box-sizing:border-box; }
.panel.open { left:0; }
.btn { margin-top:8px; padding:6px 12px; }`),
        previewHeight: 150,
        explain: 'Click Toggle a few times. In this simple preview it may look fine — the danger only shows up on a real device under real load, which is exactly why this bug is so easy to ship without noticing.',
        explainHi: 'Toggle kai baar click karo. Is saade preview mein ye theek lag sakta hai — khatra sirf asli device par asli load ke neeche dikhta hai, aur isi wajah se ye bug bina dhyan diye ship karna itna aasan hai.',
      },
      {
        title: 'The fix: animating transform instead',
        titleHi: 'Fix: iske bajaye transform animate karna',
        code: `.panel { transform: translateX(-260px); transition: transform 0.4s; }
.panel.open { transform: translateX(0); }`,
        preview: page(`<div class="wrap">
  <div class="panel open">transform: translateX(-260px) &rarr; translateX(0). This runs on the compositor — layout is never touched.</div>
</div>
<button class="btn" onclick="document.querySelector('.panel').classList.toggle('open')">Toggle</button>`,
`.wrap { position:relative; height:70px; overflow:hidden; border:2px dashed #94a3b8; }
.panel { position:absolute; left:0; top:0; width:240px; height:70px; background:#bbf7d0; border:1px solid #10b981; padding:8px; font-size:12px; transform:translateX(-260px); transition:transform 0.4s; box-sizing:border-box; }
.panel.open { transform:translateX(0); }
.btn { margin-top:8px; padding:6px 12px; }`),
        previewHeight: 150,
        explain: 'Visually identical motion. The difference is invisible here but measurable on a real device: this version never asks the layout engine a question, so it cannot be starved by a busy page the way the `left` version can.',
        explainHi: 'Dikhne mein wahi motion. Fark yahan adrishya hai par asli device par naapa ja sakta hai: ye version layout engine se kabhi kuch nahi poochta, isliye ise vyast page bhookha nahi rakh sakta jaise \`left\` wala version.',
      },
      {
        title: 'opacity: also compositor-only',
        titleHi: 'opacity: ye bhi sirf-compositor',
        code: `.tip { opacity: 0; transition: opacity 0.25s; }
.tip.visible { opacity: 1; }`,
        preview: page(`<button class="btn" onclick="document.querySelector('.tip').classList.toggle('visible')">Toggle tooltip</button>
<div class="tip">A fade like this is exactly as cheap as a transform-based slide.</div>`,
`.btn { padding:6px 12px; }
.tip { opacity:0; transition:opacity 0.25s; margin-top:8px; background:#dbeafe; padding:10px; font-size:13px; border-radius:4px; }
.tip.visible { opacity:1; }`),
        previewHeight: 130,
        explain: 'Opacity changes never touch layout, exactly like transform — the element\'s box never changes size or position, only its blended appearance, so the compositor handles the entire animation alone.',
        explainHi: 'Opacity ke badlav kabhi layout ko chhoote nahi, bilkul transform ki tarah — element ka box kabhi size ya position nahi badalta, sirf uska mila hua dikhna, isliye compositor akela poora animation sambhal leta hai.',
      },
      {
        title: 'Combining multiple transform functions',
        titleHi: 'Kai transform functions ko milana',
        code: `.card:hover { transform: translateY(-6px) scale(1.03); }`,
        preview: page(`<div class="c">Hover me</div>`,
`.c { width:160px; padding:20px; background:#dbeafe; border:1px solid #60a5fa; text-align:center; font-size:13px; transition:transform 0.2s ease-out; }
.c:hover { transform:translateY(-6px) scale(1.03); }`),
        previewHeight: 90,
        explain: 'Two functions in one declaration — a lift and a slight grow — both computed on the compositor in a single step. This "hover lift" is one of the most common UI micro-interactions on the web, and it costs almost nothing.',
        explainHi: 'Ek declaration mein do functions — uthana aur thoda badhna — dono compositor par ek hi step mein ganit hote hain. Ye "hover lift" web ke sabse aam UI micro-interactions mein se ek hai, aur iski keemat lagbhag kuch nahi.',
      },
      {
        title: 'Order matters: translate-then-rotate vs rotate-then-translate',
        titleHi: 'Kram matter karta hai: translate-phir-rotate vs rotate-phir-translate',
        code: `.a { transform: translateX(60px) rotate(45deg); }
.b { transform: rotate(45deg) translateX(60px); }`,
        preview: page(`<div class="row">
  <div class="box a">A</div>
  <div class="box b">B</div>
</div>
<p style="font-size:13px;color:#666;margin-top:8px">Same two functions, opposite order, different final position — because the second function operates in the coordinate space the first one left behind.</p>`,
`.row { display:flex; gap:60px; height:100px; align-items:center; }
.box { width:40px; height:40px; background:#dbeafe; border:1px solid #60a5fa; display:flex; align-items:center; justify-content:center; font-size:12px; }
.a { transform:translateX(60px) rotate(45deg); }
.b { transform:rotate(45deg) translateX(60px); }`),
        previewHeight: 130,
        explain: 'Box A moves right, then rotates around its new position. Box B rotates first, so its local "rightward" axis is now diagonal, and it translates along that tilted axis instead — same functions, genuinely different results.',
        explainHi: 'Box A dayein khisakta hai, phir apni nayi jagah ke aas-paas ghoomta hai. Box B pehle ghoomta hai, isliye uski local "dayein" axis ab tirchi hai, aur wo us tirchi axis ke saath khisakta hai — wahi functions, sach mein alag nateeje.',
      },
      {
        title: 'ease-out for entrances, ease-in for exits',
        titleHi: 'Aane ke liye ease-out, jaane ke liye ease-in',
        code: `.enter { transition: transform 0.3s ease-out; }
.exit  { transition: transform 0.3s ease-in; }`,
        preview: page(`<button class="btn" onclick="const e=document.querySelector('.card');e.classList.toggle('in')">Toggle</button>
<div class="card">ease-out entrance / ease-in exit</div>`,
`.btn{padding:6px 12px;margin-bottom:8px}
.card{transform:translateY(-16px);opacity:0;transition:transform 0.3s ease-in, opacity 0.3s ease-in;background:#dbeafe;padding:14px;font-size:13px}
.card.in{transform:translateY(0);opacity:1;transition:transform 0.3s ease-out, opacity 0.3s ease-out}`),
        previewHeight: 130,
        explain: 'The entrance decelerates as it arrives (ease-out) which reads as the element settling into place; the exit accelerates away (ease-in) which reads as it being pulled off screen. Matching the curve to the direction is what makes motion feel intentional rather than mechanical.',
        explainHi: 'Aana pahunchte waqt dheema hota hai (ease-out) jo element ke apni jagah baithne jaisa lagta hai; jaana door hote hote tez hota hai (ease-in) jo screen se khinchkar hataye jaane jaisa lagta hai. Curve ko disha se milana hi motion ko jaan-boojha hua banata hai, mechanical nahi.',
      },
      {
        title: 'transition: all — convenient but imprecise',
        titleHi: 'transition: all — aasan par imprecise',
        code: `.btn { transition: all 0.2s; }
/* later, someone adds a layout-affecting property without noticing it now animates too */
.btn:hover { transform: scale(1.05); width: 140px; }`,
        preview: page(`<button class="btn">Hover me</button>
<p style="font-size:13px;color:#666;margin-top:8px">Both the transform AND the width change animate — the width change was probably not meant to be part of this "hover lift" effect.</p>`,
`.btn { padding:10px 16px; width:100px; transition:all 0.2s; background:#dbeafe; border:1px solid #60a5fa; }
.btn:hover { transform:scale(1.05); width:140px; }`),
        previewHeight: 130,
        explain: 'Hover to see both properties animate together. `transition: all` is convenient while prototyping, but naming `transform` explicitly instead would have made it obvious that width was never meant to be part of this transition.',
        explainHi: 'Dono properties saath animate hote hue dekhne ke liye hover karo. Prototype karte waqt \`transition: all\` aasan hai, par seedha \`transform\` naam se likhna saaf kar deta ki width kabhi is transition ka hissa hone wali thi hi nahi.',
      },
      {
        title: 'transform-origin changes the pivot point',
        titleHi: 'transform-origin pivot point badalta hai',
        code: `.a { transform-origin: center; transform: rotate(20deg); }
.b { transform-origin: top left; transform: rotate(20deg); }`,
        preview: page(`<div class="row">
  <div class="box a">center</div>
  <div class="box b">top left</div>
</div>`,
`.row { display:flex; gap:50px; height:100px; align-items:center; padding-left:20px; }
.box { width:60px; height:40px; background:#dbeafe; border:1px solid #60a5fa; display:flex; align-items:center; justify-content:center; font-size:11px; }
.a { transform-origin:center; transform:rotate(20deg); }
.b { transform-origin:top left; transform:rotate(20deg); }`),
        previewHeight: 130,
        explain: 'Identical 20deg rotation, different pivot point. The default `center` spins the box around its middle; `top left` swings it like a door hinged at that corner instead.',
        explainHi: 'Bilkul wahi 20deg rotation, alag pivot point. Default \`center\` box ko uske beech ke aas-paas ghumata hai; \`top left\` use us corner par tikay darwaze ki tarah jhulata hai.',
      },
      {
        title: 'A card flip using two transforms and perspective',
        titleHi: 'Do transforms aur perspective se card flip',
        code: `.scene { perspective: 800px; }
.card:hover .inner { transform: rotateY(180deg); }`,
        preview: page(`<div class="scene"><div class="inner"><div class="front">Front</div><div class="back">Back</div></div></div>
<p style="font-size:13px;color:#666;margin-top:8px">Hover the card to flip it.</p>`,
`.scene { width:140px; height:90px; perspective:800px; }
.inner { position:relative; width:100%; height:100%; transition:transform 0.5s; transform-style:preserve-3d; }
.scene:hover .inner { transform:rotateY(180deg); }
.front, .back { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; backface-visibility:hidden; font-size:13px; }
.front { background:#dbeafe; }
.back { background:#bbf7d0; transform:rotateY(180deg); }`),
        previewHeight: 130,
        explain: '`perspective` on the parent gives the 3D rotation a vanishing point, and `rotateY` combined with `backface-visibility: hidden` is the entire recipe behind nearly every "flip card" component, and it runs entirely on the compositor.',
        explainHi: 'Parent par \`perspective\` 3D rotation ko ek vanishing point deta hai, aur \`rotateY\` \`backface-visibility: hidden\` ke saath milkar lagbhag har "flip card" component ki poori recipe hai, aur ye poori tarah compositor par chalta hai.',
      },
      {
        title: 'Multiple independently timed transitions',
        titleHi: 'Kai alag-alag samay ki transitions',
        code: `.el {
  transition: transform 0.2s ease-out, opacity 0.5s linear;
}`,
        preview: page(`<button class="btn" onclick="document.querySelector('.el').classList.toggle('go')">Toggle</button>
<div class="el">Position moves fast (0.2s); fade happens slowly (0.5s) — two independent clocks in one rule.</div>`,
`.btn{padding:6px 12px;margin-bottom:8px}
.el{transform:translateX(-20px);opacity:0.2;transition:transform 0.2s ease-out, opacity 0.5s linear;background:#dbeafe;padding:12px;font-size:13px}
.el.go{transform:translateX(0);opacity:1}`),
        previewHeight: 130,
        explain: 'Each comma-separated entry in `transition` gets its own duration and easing. This lets a position settle quickly while a fade lingers, a common technique for making an entrance feel less abrupt.',
        explainHi: '\`transition\` mein comma se alag har entry ki apni duration aur easing hoti hai. Isse position jaldi tik jati hai jabki fade der tak rehta hai, ek aam tarika jisse aana kam achanak lagta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `.menu { left: -280px; transition: left 0.3s; }
.menu.open { left: 0; }`,
        right: `.menu { transform: translateX(-280px); transition: transform 0.3s; }
.menu.open { transform: translateX(0); }`,
        previewWrong: page(`<div class="w"><div class="m open">left</div></div>`,
          `.w{position:relative;height:50px;overflow:hidden;border:1px dashed #ef4444}.m{position:absolute;left:0;width:200px;height:50px;background:#fee2e2;font-size:12px;padding:6px;box-sizing:border-box}`),
        previewRight: page(`<div class="w"><div class="m open">transform</div></div>`,
          `.w{position:relative;height:50px;overflow:hidden;border:1px dashed #10b981}.m{position:absolute;left:0;width:200px;height:50px;background:#dcfce7;font-size:12px;padding:6px;box-sizing:border-box}`),
        previewHeight: 90,
        why: '`left` forces layout recalculation on every animation frame — cheap on an idle test page, but the first thing to drop frames on a busy real page or a slower device. `transform` runs on the compositor and never touches layout.',
        whyHi: '\`left\` har animation frame par layout ka dobara ganit majboor karta hai — khaali test page par sasta, par vyast asli page ya dheeme device par sabse pehle frames chhodta hai. \`transform\` compositor par chalta hai aur layout ko kabhi nahi chhoota.',
      },
      {
        wrong: `.card { transition: width 0.3s; }
.card:hover { width: 280px; }`,
        right: `.card { transition: transform 0.3s; }
.card:hover { transform: scaleX(1.1); }   /* or restructure so a fixed max-width already exists */`,
        why: 'Animating `width` triggers layout every frame, same as `left`. A visual grow effect can very often be approximated with `scale`, which is compositor-only, though note scale distorts content proportionally rather than reflowing it — the right choice depends on what should happen to the content inside.',
        whyHi: '\`width\` animate karna har frame layout trigger karta hai, \`left\` jaisa hi. Badhne wala drishya asar aksar \`scale\` se andaza lagaya ja sakta hai, jo sirf-compositor hai, par dhyan do scale content ko anupaatik roop se vikrit karta hai reflow karne ke bajaye — sahi chunaav iss par nirbhar hai ki andar ke content ka kya hona chahiye.',
      },
      {
        wrong: `.btn { transition: all 0.2s; }
/* every future property change on this element now animates, intended or not */`,
        right: `.btn { transition: transform 0.2s, opacity 0.2s; }   /* name exactly what should animate */`,
        why: 'transition: all animates every property that changes, including ones added later by someone who forgot this rule exists — an unintended layout-triggering property can slip in and start animating without anyone noticing why performance regressed.',
        whyHi: 'transition: all badalne wali har property ko animate karta hai, un sameet jo baad mein koi jodta hai jise ye niyam yaad nahi raha — ek anichit layout-trigger karne wali property ghus sakti hai aur bina kisi ko pata chale animate hona shuru kar sakti hai, aur performance kyun kharab hui koi na jaan paye.',
      },
    ],

    realWorld: [
      {
        en: '**Every modal, drawer and toast library.** Radix, Headless UI, and native browser dialogs all animate with `transform` and `opacity` specifically to guarantee smooth motion regardless of the device or how busy the page is.',
        hi: '**Har modal, drawer aur toast library.** Radix, Headless UI, aur native browser dialogs sab khaas taur par \`transform\` aur \`opacity\` se animate karte hain taaki device ya page kitna bhi vyast ho, smooth motion pakki rahe.',
      },
      {
        en: '**Mobile web performance audits.** Lighthouse and Chrome DevTools\' Performance panel specifically flag "layout thrashing" from animated layout properties as a top actionable finding, alongside unoptimised images.',
        hi: '**Mobile web performance audits.** Lighthouse aur Chrome DevTools ka Performance panel animated layout properties se "layout thrashing" ko ek top actionable finding ki tarah khaas taur par flag karta hai, unoptimised images ke saath.',
      },
      {
        en: '**Game-like and gesture-driven UIs.** Anything that follows a finger drag in real time — a swipeable card stack, a bottom sheet — is built on `transform` because it is the only property class that can reliably keep up with 60fps input tracking.',
        hi: '**Game-jaisi aur gesture-driven UIs.** Kuch bhi jo real time mein ungli ke drag ko follow karta hai — swipe hone wala card stack, bottom sheet — \`transform\` par bana hota hai kyunki ye ek hi property class hai jo 60fps input tracking ke saath bharosemand tarike se chal sakti hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is animating `transform` preferred over animating `left` or `width`?',
        qHi: '\`transform\` animate karna \`left\` ya \`width\` animate karne se behtar kyun maana jata hai?',
        a: 'Properties like `left`, `width`, `top` and `margin` affect the document\'s layout, so changing them forces the browser to recompute the size and position of the element — and potentially its neighbours — on every single animation frame, then repaint the affected pixels. `transform` and `opacity` do not participate in layout at all; once the element is painted, the browser can hand that layer to the compositor, typically running on the GPU, and have it interpolate position, scale, rotation or alpha independently, without ever calling back into the layout engine. On a busy page or a slower device, layout-triggering animations are the first to miss the roughly 16.7ms per-frame budget and produce visible stutter.',
        aHi: '\`left\`, \`width\`, \`top\` aur \`margin\` jaisi properties document ke layout ko asar karti hain, isliye inhe badalne se browser ko har ek animation frame par element ka — aur ho sakta hai uske padosiyon ka bhi — size aur position dobara ganit karna padta hai, phir asar hue pixels ko dobara paint karna padta hai. \`transform\` aur \`opacity\` layout mein bilkul hissa nahi lete; ek baar element paint ho jaye, browser wo layer compositor ko de sakta hai, jo aksar GPU par chalta hai, aur use position, scale, rotation ya alpha khud interpolate karne de sakta hai, layout engine ko kabhi wapas bulaye bina. Vyast page ya dheeme device par, layout-trigger karne wale animations sabse pehle lagbhag 16.7ms wale per-frame budget ko chookte hain aur dikhta hua stutter paida karte hain.',
      },
      {
        q: 'What is the layout / paint / composite pipeline, and where does each animatable property fall in it?',
        qHi: 'Layout / paint / composite pipeline kya hai, aur har animate hone layak property isme kahan aati hai?',
        a: 'A visual change can trigger up to three stages: layout, which recalculates size and position; paint, which redraws pixels into layers; and composite, which combines layers on the GPU for display. Properties like `width`, `height`, `top`, `left`, and `margin` trigger all three. Properties like `background-color`, `box-shadow`, and `border-color` skip layout but still trigger paint and composite. `transform`, `opacity`, and `filter` skip both layout and paint and only trigger composite, which is why they are the safe set for smooth animation.',
        aHi: 'Ek drishya badlav teen tak stages trigger kar sakta hai: layout, jo size aur position dobara ganit karta hai; paint, jo pixels ko layers mein dobara khinchta hai; aur composite, jo dikhane ke liye layers ko GPU par jodta hai. \`width\`, \`height\`, \`top\`, \`left\`, aur \`margin\` jaisi properties teenon trigger karti hain. \`background-color\`, \`box-shadow\`, aur \`border-color\` jaisi properties layout chhod deti hain par phir bhi paint aur composite trigger karti hain. \`transform\`, \`opacity\`, aur \`filter\` layout aur paint dono chhod dete hain aur sirf composite trigger karte hain, isiliye ye smooth animation ke liye surakshit set hain.',
      },
      {
        q: 'What is the 60fps budget, and why does it matter for CSS animation?',
        qHi: '60fps ka budget kya hai, aur CSS animation ke liye ye kyun matter karta hai?',
        a: 'A screen refreshing at 60Hz needs a new frame roughly every 16.7 milliseconds. The browser must complete all of its work for that frame — layout, paint, composite, and any JavaScript — within that window, or the frame is dropped or delayed, which the user perceives as stutter or jank. This matters for animation choice because a layout-triggering property has to redo expensive work inside that same tight window on every frame of the animation, competing with everything else happening on the page, while a compositor-only property like `transform` bypasses that competition entirely.',
        aHi: '60Hz par refresh hoti screen ko har lagbhag 16.7 milliseconds mein ek naya frame chahiye. Browser ko us frame ke liye apna sara kaam — layout, paint, composite, aur koi bhi JavaScript — us window ke andar poora karna hota hai, nahi to frame chhoot jata hai ya der se aata hai, jo user ko stutter ya jank ki tarah mehsoos hota hai. Ye animation ke chunaav ke liye matter karta hai kyunki layout-trigger karne wali property ko animation ke har frame par usi tang window ke andar mehenga kaam dobara karna padta hai, page par ho rahi baaki har cheez se compete karte hue, jabki \`transform\` jaisi sirf-compositor property us competition se poori tarah bach jati hai.',
      },
      {
        q: 'Why does the order of multiple transform functions matter?',
        qHi: 'Kai transform functions ka kram kyun matter karta hai?',
        a: 'Each function in a `transform` declaration operates within the coordinate system left behind by the function before it, so `translateX(60px) rotate(45deg)` and `rotate(45deg) translateX(60px)` produce different results. In the first, the element moves along the original horizontal axis and then rotates around its new position. In the second, the element rotates first, which tilts its local axes, so the subsequent translate moves it along that now-tilted direction instead of the original horizontal.',
        aHi: '\`transform\` declaration ka har function us coordinate system mein kaam karta hai jo usse pehle wale function ne chhoda tha, isliye \`translateX(60px) rotate(45deg)\` aur \`rotate(45deg) translateX(60px)\` alag nateeje dete hain. Pehle mein, element asli leti axis ke saath hilta hai aur phir apni nayi jagah ke aas-paas ghoomta hai. Doosre mein, element pehle ghoomta hai, jo uski local axes ko tirchi kar deti hai, isliye baad ka translate use asli leti disha ke bajaye us ab-tirchi disha mein hilata hai.',
      },
      {
        q: 'Why is `transition: all` generally discouraged in production code?',
        qHi: 'Production code mein \`transition: all\` ko aksar kyun mana kiya jata hai?',
        a: '`transition: all` animates every property that changes on the element, not just the ones the author consciously intended to animate. This is convenient while prototyping, but it silently applies to any property a future change adds — including layout-triggering ones like `width` or `margin` — so a well-intentioned later edit can introduce an unintended, potentially janky animation with no obvious cause. Naming the properties explicitly, such as `transition: transform 0.2s, opacity 0.2s`, keeps the animated surface area visible and intentional.',
        aHi: '\`transition: all\` element par badalne wali har property ko animate karta hai, sirf unhi ko nahi jinhe likhne wale ne jaan-boojh kar animate karna socha tha. Prototype banate waqt ye aasan hai, par ye chupchap kisi bhi property par lagu ho jata hai jo koi future badlav jode — layout-trigger karne wali \`width\` ya \`margin\` jaisi bhi — isliye ek achhi niyat wala baad ka edit bina kisi saaf wajah ke ek anichit, shayad jhatakti hui animation la sakta hai. Properties ko seedha naam se likhna, jaise \`transition: transform 0.2s, opacity 0.2s\`, animate hote hue surface area ko dikhta aur jaan-boojha hua rakhta hai.',
      },
    ],

    exercises: [
      {
        task: 'Build the same slide-in panel twice, once transitioning `left` and once transitioning `transform`. Open Chrome DevTools\' Performance panel, record both, and compare whether "Layout" appears in the recorded frames.',
        taskHi: 'Wahi slide-in panel do baar banao, ek \`left\` transition karke aur ek \`transform\` transition karke. Chrome DevTools ka Performance panel kholo, dono record karo, aur compare karo ki recorded frames mein "Layout" dikhta hai ya nahi.',
        hint: 'The left version should show purple "Layout" bars in the recording; the transform version should not.',
        hintHi: '\`left\` wale version mein recording mein purple "Layout" bars dikhni chahiye; \`transform\` wale mein nahi.',
      },
      {
        task: 'Build a hover-lift card effect using `transform: translateY() scale()` combined in one declaration, then add a matching `ease-out` entrance and `ease-in` exit for a tooltip that appears alongside it.',
        taskHi: '\`transform: translateY() scale()\` ko ek declaration mein milakar hover-lift card asar banao, phir uske saath dikhne wale tooltip ke liye milta \`ease-out\` entrance aur \`ease-in\` exit jodo.',
        hint: 'Two functions in one `transform` value are computed together in a single compositor step — no extra cost for combining them.',
        hintHi: 'Ek \`transform\` value mein do functions ek hi compositor step mein saath ganit hote hain — unhe milane ki koi extra keemat nahi.',
      },
      {
        task: 'Take a component using `transition: all` and rewrite it to name each property explicitly. Then intentionally add a new hover style with a layout-affecting property and observe that it no longer silently animates.',
        taskHi: '\`transition: all\` use karne wala component lo aur use dobara likho har property ko seedha naam dekar. Phir jaan-boojh kar ek naya hover style jodo jisme layout-asar wali property ho aur dekho ki wo ab chupchap animate nahi hota.',
        hint: 'The point is that removing `all` makes future additions explicit rather than accidentally inherited.',
        hintHi: 'Baat ye hai ki \`all\` hataane se future ke jode gaye rules seedhe dikhte hain, galti se inherit hue nahi.',
      },
    ],

    keyTakeaways: [
      'Properties like `left`, `width`, and `top` trigger layout on every animation frame; `transform`, `opacity`, and `filter` run on the compositor alone.',
      'A 60Hz screen gives the browser roughly 16.7ms per frame — layout-triggering animations are the first to miss that budget under load.',
      'Prefer `transform: translate()` over `left`/`top`, and `transform: scale()` over `width`/`height`, whenever the visual result can be equivalent.',
      'Multiple transform functions apply in the order written, because each operates in the coordinate space the previous one left behind.',
      '`ease-out` suits things entering the screen; `ease-in` suits things leaving it — the curve should match the direction of motion.',
      '`transition: all` is convenient but animates every future property change, intended or not — name properties explicitly in production code.',
    ],
    keyTakeawaysHi: [
      '\`left\`, \`width\`, aur \`top\` jaisi properties har animation frame par layout trigger karti hain; \`transform\`, \`opacity\`, aur \`filter\` akele compositor par chalte hain.',
      '60Hz screen browser ko har frame ke liye lagbhag 16.7ms deti hai — load ke neeche layout-trigger karne wale animations sabse pehle wo budget chookte hain.',
      '\`left\`/\`top\` ke bajaye \`transform: translate()\`, aur \`width\`/\`height\` ke bajaye \`transform: scale()\` pasand karo, jab bhi drishya nateeja barabar ho sake.',
      'Kai transform functions likhe hue kram mein lagte hain, kyunki har ek us coordinate space mein kaam karta hai jo pichhle ne chhoda tha.',
      '\`ease-out\` screen mein aane wali cheezon ke liye sahi hai; \`ease-in\` jaane wali cheezon ke liye — curve ko motion ki disha se milna chahiye.',
      '\`transition: all\` aasan hai par har future property badlav ko animate karta hai, chahe irada ho ya na ho — production code mein properties ko seedha naam do.',
    ],
  },
];
