import type { SeedProblem } from './shared';

/**
 * CSS & Web Animations — Transitions, keyframes, performance, and advanced techniques.
 * From smooth micro-interactions to award-winning animation patterns.
 */

export const ANIMATION_CATEGORIES = [
  'CSS Transitions',
  'CSS Keyframes & Animations',
  'Performance & Optimization',
  'Advanced Patterns',
  'JavaScript Animations',
] as const;

export const animationTopics = [
  {
    slug: 'anim-css-transitions',
    title: 'CSS Transitions: Smooth State Changes',
    category: 'CSS Transitions',
    difficulty: 'EASY',
    summary: 'Smooth property changes from one state to another. The foundation of micro-interactions.',
    content: `## What is a Transition?

A transition smoothly animates a property change over time. No animation needed—just declare before and after states.

\`\`\`css
button {
  background: blue;
  color: white;
  /* Animate ALL properties changing over 0.3s */
  transition: all 0.3s ease;
}

button:hover {
  background: darkblue;
  transform: scale(1.05);
}
\`\`\`

When you hover, the background and scale smoothly transition instead of snapping.

## Transition Properties

\`\`\`css
.box {
  /* 1. Which properties to animate */
  transition-property: background, transform, opacity;
  /* OR: all (slow), or none */

  /* 2. How long (milliseconds or seconds) */
  transition-duration: 300ms;
  transition-duration: 0.3s;

  /* 3. Timing function (easing) */
  transition-timing-function: ease;         /* default */
  transition-timing-function: ease-in;      /* slow start, fast end */
  transition-timing-function: ease-out;     /* fast start, slow end */
  transition-timing-function: ease-in-out;  /* slow both ends */
  transition-timing-function: linear;       /* constant speed */
  transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55); /* custom bounce */

  /* 4. Delay before starting (optional) */
  transition-delay: 100ms;

  /* Shorthand */
  transition: property duration timing-function delay;
  transition: background 0.3s ease 0s;
}
\`\`\`

## Timing Functions Explained

\`\`\`css
.ease {
  transition: all 1s ease;        /* ⭐ Default, good for most things */
}

.linear {
  transition: all 1s linear;      /* Constant speed, feels mechanical */
}

.easeOut {
  transition: all 1s ease-out;    /* ⭐ Best for enter animations (appears fast) */
}

.easeIn {
  transition: all 1s ease-in;     /* Best for exit animations (leaves slow) */
}

.custom {
  /* cubic-bezier(x1, y1, x2, y2): smooth curve between 0 and 1 */
  /* Bounce effect */
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  /* Elastic effect */
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
\`\`\`

## Common Patterns

**Button Hover (ease-out for snappy feel):**
\`\`\`css
button {
  transition: all 0.2s ease-out;
}
button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
\`\`\`

**Fade In (opacity transition):**
\`\`\`css
.modal {
  opacity: 0;
  transition: opacity 0.3s ease;
}
.modal.visible {
  opacity: 1;
}
\`\`\`

**Slide In from Left:**
\`\`\`css
.drawer {
  transform: translateX(-100%);
  transition: transform 0.3s ease-out;
}
.drawer.open {
  transform: translateX(0);
}
\`\`\`

## Performant Transitions

⚠️ **Slow properties** (trigger layout recalculation):
\`\`\`css
transition: width, height, left, top; /* Causes reflow */
\`\`\`

✅ **Fast properties** (GPU accelerated):
\`\`\`css
transition: transform, opacity; /* No reflow */
\`\`\`

**Always use \`transform\` and \`opacity\` for smooth 60fps animations.**

\`\`\`css
/* ❌ Jank: repaints the page repeatedly */
.box {
  transition: left 0.3s;
}
.box.open {
  left: 300px;
}

/* ✓ Smooth: GPU accelerated */
.box {
  transition: transform 0.3s;
}
.box.open {
  transform: translateX(300px);
}
\`\`\`

## Disabling Transitions

\`\`\`css
/* Transition off during heavy operations */
.no-transition {
  transition: none;
}
\`\`\`

\`\`\`js
element.classList.add('no-transition');
element.style.left = '500px'; // Instant
element.classList.remove('no-transition');
\`\`\`
`,
    contentHi: `## Transitions

State change ko smooth karo. \`hover\` mein animation auto.

\`\`\`css
button {
  transition: all 0.3s ease;
}
button:hover {
  background: darkblue;
}
\`\`\`

## Properties

\`\`\`css
transition-property: background, transform;
transition-duration: 0.3s;
transition-timing-function: ease;
transition-delay: 0.1s;

/* Shorthand */
transition: background 0.3s ease 0.1s;
\`\`\`

## Timing Functions

\`\`\`css
ease;        /* Default, smooth */
ease-out;    /* Fast start, slow end (enter animations) */
ease-in;     /* Slow start, fast end (exit animations) */
linear;      /* Constant (mechanical) */
\`\`\`

## Performance

**Use transform aur opacity, nahi width/left:**
\`\`\`css
/* ✓ Fast */
transition: transform 0.3s;

/* ❌ Slow - causes reflow */
transition: left 0.3s;
\`\`\`
`,
    simple: `Transitions smoothly animate property changes. \`transition: all 0.3s ease\` and then change state in CSS. Use \`transform\` and \`opacity\` for 60fps performance.`,
    simpleHi: `Transitions property change ko smooth karte hain. \`transition: all 0.3s ease\` likho aur state badle. Performance ke liye \`transform\` use karo.`,
    tricks: `\`ease-out\` for enter, \`ease-in\` for exit. Always use \`transform\` not \`left/top\`. Transitions are free performance-wise when you use the right properties.`,
    tricksHi: `\`ease-out\` enter ke liye, \`ease-in\` exit ke liye. \`transform\` use karo, \`left/top\` nahi. Transform GPU accelerated hota hai.`,
    codeExample: `<style>
button {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease-out;
}

button:hover {
  background: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.modal {
  opacity: 0;
  transform: scale(0.9);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.modal.visible {
  opacity: 1;
  transform: scale(1);
}
</style>

<button>Hover me</button>
<div class="modal visible">Modal content</div>`,
    expectedOutput: `Smooth button scale and shadow on hover, smooth modal appearance`,
    commonMistakes: [
      'Using transition on width/height instead of transform',
      'Wrong timing function for the effect (ease-in when ease-out better)',
      'Transition lasting too long (hard to feel responsive)',
      'Not using transform for position changes',
    ],
    interviewQuestions: [
      'How do CSS transitions work?',
      'Explain the difference between ease-in and ease-out',
      'Why should you use transform instead of left/top?',
      'How do you make a transition instant for one change?',
    ],
    practiceQuestions: [
      'Create a smooth button hover effect',
      'Build a modal that fades and scales in',
      'Implement a drawer that slides from the side',
    ],
    relatedProblemSlugs: [],
    tags: ['css', 'transitions', 'animations', 'performance', 'smoothness'],
  },

  {
    slug: 'anim-css-keyframes',
    title: 'CSS Keyframes: Complex Animations',
    category: 'CSS Keyframes & Animations',
    difficulty: 'MEDIUM',
    summary: 'Define multi-step animations with keyframes. Loops, repeats, and intricate motion patterns.',
    content: `## Keyframes Basics

Keyframes define animation stages (0% to 100%) and CSS properties at each stage.

\`\`\`css
@keyframes slideIn {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

.box {
  animation: slideIn 0.5s ease-out forwards;
}
\`\`\`

## Animation Properties

\`\`\`css
.animated {
  /* 1. Animation name */
  animation-name: slideIn;

  /* 2. Duration */
  animation-duration: 0.5s;

  /* 3. Timing function */
  animation-timing-function: ease-out;

  /* 4. Delay before starting */
  animation-delay: 0.2s;

  /* 5. How many times */
  animation-iteration-count: 1;          /* once */
  animation-iteration-count: infinite;   /* loop forever */
  animation-iteration-count: 3;          /* 3 times */

  /* 6. Direction: normal, reverse, alternate */
  animation-direction: normal;     /* 0% → 100%, then jump back */
  animation-direction: reverse;    /* 100% → 0% */
  animation-direction: alternate;  /* 0% → 100% → 0%, smooth loop */
  animation-direction: alternate-reverse;

  /* 7. State when done */
  animation-fill-mode: forwards;   /* stay at 100% */
  animation-fill-mode: backwards;  /* jump back to 0% */
  animation-fill-mode: both;       /* respect both ends */
  animation-fill-mode: none;       /* default (jump back) */

  /* 8. Pause/play */
  animation-play-state: running;   /* default */
  animation-play-state: paused;

  /* Shorthand */
  animation: slideIn 0.5s ease-out 0s 1 normal forwards;
}
\`\`\`

## Multi-Step Animations

\`\`\`css
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  25% {
    transform: translateY(-20px);
  }
  50% {
    transform: translateY(0);
  }
  75% {
    transform: translateY(-10px);
  }
}

.box {
  animation: bounce 1s ease-in-out infinite;
}
\`\`\`

## Common Animation Patterns

**Fade In:**
\`\`\`css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
\`\`\`

**Rotate:**
\`\`\`css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.spinner {
  animation: spin 2s linear infinite;
}
\`\`\`

**Pulse:**
\`\`\`css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
.dot {
  animation: pulse 2s ease-in-out infinite;
}
\`\`\`

**Slide & Fade In (Google Material Design style):**
\`\`\`css
@keyframes slideAndFadeIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.card {
  animation: slideAndFadeIn 0.5s ease-out forwards;
}

/* Stagger effect: each card slightly delayed */
.card:nth-child(1) { animation-delay: 0s; }
.card:nth-child(2) { animation-delay: 0.1s; }
.card:nth-child(3) { animation-delay: 0.2s; }
\`\`\`

## Animation Timing

⚠️ **Same as transitions:**
- Use \`transform\` and \`opacity\` for performance
- \`ease-out\` for entrances, \`ease-in\` for exits
- \`ease-in-out\` for loops

## Animation Events (JavaScript)

\`\`\`js
const box = document.querySelector('.box');

box.addEventListener('animationstart', () => {
  console.log('Animation started');
});

box.addEventListener('animationiteration', () => {
  console.log('Animation repeated');
});

box.addEventListener('animationend', () => {
  console.log('Animation finished');
});
\`\`\`

## Control with JavaScript

\`\`\`js
const box = document.querySelector('.box');

// Play
box.style.animationPlayState = 'running';

// Pause
box.style.animationPlayState = 'paused';

// Change animation
box.style.animation = 'slideIn 1s ease-out forwards';
\`\`\`
`,
    contentHi: `## Keyframes

Multi-step animations define karte hain.

\`\`\`css
@keyframes slideIn {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(0); }
}

.box {
  animation: slideIn 0.5s ease-out forwards;
}
\`\`\`

## Animation Properties

\`\`\`css
animation-name: slideIn;
animation-duration: 0.5s;
animation-timing-function: ease-out;
animation-delay: 0.2s;
animation-iteration-count: 1;     /* or infinite */
animation-direction: alternate;   /* 0→100→0 */
animation-fill-mode: forwards;    /* Stay at end */
\`\`\`

## Common Patterns

**Bounce:**
\`\`\`css
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}
\`\`\`

**Spin (loader):**
\`\`\`css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spinner {
  animation: spin 2s linear infinite;
}
\`\`\`

## Stagger Effect (cards)

\`\`\`css
.card { animation: slideIn 0.5s ease-out forwards; }
.card:nth-child(2) { animation-delay: 0.1s; }
.card:nth-child(3) { animation-delay: 0.2s; }
\`\`\`
`,
    simple: `Keyframes define multi-step animations. Use \`@keyframes slideIn { 0% {} 100% {} }\` and apply with \`animation: slideIn 0.5s ease-out forwards\`. Use \`alternate\` for smooth loops.`,
    simpleHi: `Keyframes multi-step animations define karte hain. \`animation-iteration-count: infinite\` se loop kro. \`animation-direction: alternate\` se smooth loop.`,
    tricks: `\`animation-fill-mode: forwards\` to stay at end. \`alternate\` for loops without jump. Stagger with \`animation-delay\` on nth-child.`,
    tricksHi: `\`forwards\` se end par stay karo. \`alternate\` smooth loop. \`nth-child\` se stagger karo.`,
    codeExample: `<style>
@keyframes slideAndFadeIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.card {
  animation: slideAndFadeIn 0.5s ease-out forwards;
}

.card:nth-child(1) { animation-delay: 0s; }
.card:nth-child(2) { animation-delay: 0.1s; }
.card:nth-child(3) { animation-delay: 0.2s; }

.bounce {
  animation: bounce 1s ease-in-out infinite;
}
</style>

<div class="card">Card 1</div>
<div class="card">Card 2</div>
<div class="card">Card 3</div>
<div class="bounce">Bouncing element</div>`,
    expectedOutput: `Cards slide in with staggered delays, bouncing element loops smoothly`,
    commonMistakes: [
      'Using \`animation-fill-mode: none\` and wondering why animation resets',
      'Not using \`transform\` for position changes',
      'Infinite loops that block interaction',
      'Wrong timing function for the effect',
    ],
    interviewQuestions: [
      'How do keyframes work in CSS?',
      'Explain animation-direction: alternate',
      'What does animation-fill-mode: forwards do?',
      'How do you stagger animations for multiple elements?',
    ],
    practiceQuestions: [
      'Create a loading spinner animation',
      'Build a bounce animation that repeats 3 times',
      'Implement a card stack where each slides in sequentially',
    ],
    relatedProblemSlugs: [],
    tags: ['css', 'keyframes', 'animations', 'loops', 'timing'],
  },

  {
    slug: 'anim-performance-optimization',
    title: 'Animation Performance: 60fps Smooth',
    category: 'Performance & Optimization',
    difficulty: 'HARD',
    summary: 'Achieve butter-smooth 60fps animations. GPU acceleration, jank elimination, and profiling.',
    content: `## 60fps Target

60 frames per second = 16.67ms per frame. Missing one frame = visible stutter.

## GPU-Accelerated Properties

Only these properties don't trigger layout recalculation (reflow):

✅ **GPU Accelerated (Fast):**
- \`transform\` (translate, rotate, scale, skew)
- \`opacity\`

❌ **Causes Reflow (Slow):**
- \`width\`, \`height\`
- \`left\`, \`right\`, \`top\`, \`bottom\` (position)
- \`padding\`, \`margin\`
- \`border\`
- Any layout-affecting property

\`\`\`css
/* ❌ 10fps: repaints layout every frame */
.box {
  animation: moveLeft 1s;
}
@keyframes moveLeft {
  from { left: 0; }
  to { left: 500px; }
}

/* ✓ 60fps: GPU accelerated */
.box {
  animation: moveLeft 1s;
}
@keyframes moveLeft {
  from { transform: translateX(0); }
  to { transform: translateX(500px); }
}
\`\`\`

## Enable GPU Acceleration

\`\`\`css
.animated {
  /* Hint to browser: use GPU */
  transform: translateZ(0);
  /* or */
  will-change: transform;
}
\`\`\`

⚠️ **Use \`will-change\` sparingly** — it allocates GPU memory. Remove when done.

\`\`\`js
// Add when animation starts
element.style.willChange = 'transform';

// Remove when done
element.addEventListener('animationend', () => {
  element.style.willChange = 'auto';
});
\`\`\`

## Repaint & Reflow Explained

**Reflow (layout recalculation)** — Most expensive
- Changes that affect layout (width, position, padding)
- Triggers recalculation of all affected elements
- Then causes repaint

**Repaint** — Less expensive
- Changes that don't affect layout (color, background, opacity)
- Redraws pixels without recalculating layout

**Composite** — Cheapest
- Changes to GPU-accelerated layers (transform, opacity)
- No layout recalculation, no repaint

\`\`\`css
/* Reflow: expensive */
.box { left: 100px; }

/* Repaint: cheaper */
.box { color: red; }

/* Composite: cheapest */
.box { transform: translateX(100px); }
\`\`\`

## Profiling Performance

**Chrome DevTools:**
1. Open DevTools → Performance tab
2. Click record
3. Interact with animation
4. Stop recording
5. Look at FPS graph and frame breakdown

**Timeline:** Shows paint (red), layout (purple), script (yellow).
**Goal:** Smooth green line at 60fps. No red/yellow in animation.

## Common Perf Pitfalls

**❌ Animating background-position (common mistake):**
\`\`\`css
@keyframes slide {
  0% { background-position: 0 0; }
  100% { background-position: 100% 0; }
}
\`\`\`

**✓ Use a different approach:**
\`\`\`css
@keyframes slide {
  0% { transform: translateX(0); }
  100% { transform: translateX(100%); }
}
/* Put background on pseudo-element or parent */
\`\`\`

**❌ Animating box-shadow (expensive):**
\`\`\`css
.box {
  transition: box-shadow 0.3s;
}
.box:hover {
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}
\`\`\`

**✓ Use opacity instead:**
\`\`\`css
.box::before {
  content: '';
  position: absolute;
  opacity: 0;
  transition: opacity 0.3s;
}
.box:hover::before {
  opacity: 1;
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}
\`\`\`

## Debouncing Expensive Operations

\`\`\`js
let rafId;

window.addEventListener('mousemove', (e) => {
  // Debounce with requestAnimationFrame
  if (rafId) cancelAnimationFrame(rafId);

  rafId = requestAnimationFrame(() => {
    // This runs at 60fps max, not on every mousemove
    updateElement(e.clientX, e.clientY);
  });
});
\`\`\`

## requestAnimationFrame (rAF)

Always use \`rAF\` for JavaScript animations—syncs with browser refresh rate.

\`\`\`js
let position = 0;

function animate() {
  position += 5;
  element.style.transform = \`translateX(\${position}px)\`;

  if (position < 500) {
    requestAnimationFrame(animate);
  }
}

requestAnimationFrame(animate);
\`\`\`

**Why rAF?**
- Syncs with monitor refresh (60fps on 60Hz monitor)
- Pauses when tab is hidden (saves battery)
- Throttled to one call per frame
`,
    contentHi: `## 60fps

16.67ms per frame. Ek frame miss ho = stutter visible.

## GPU-Accelerated Properties

**✓ Fast (transform, opacity):**
\`\`\`css
transform: translateX(500px);
opacity: 0.5;
\`\`\`

**❌ Slow (layout properties):**
\`\`\`css
left: 500px;  /* Reflow */
width: 100px; /* Reflow */
\`\`\`

## will-change

\`\`\`css
.animated {
  will-change: transform;
}
\`\`\`

⚠️ Sparingly use karo, memory allocate hota hai.

## DevTools Profiling

Performance tab → record → animate → stop
FPS graph dekho, smooth green line chahiye.

## Common Mistakes

**❌ background-position animate karna:**
\`\`\`css
@keyframes slide {
  0% { background-position: 0 0; }
  100% { background-position: 100% 0; }
}
\`\`\`

**✓ Transform use karo:**
\`\`\`css
@keyframes slide {
  0% { transform: translateX(0); }
  100% { transform: translateX(100%); }
}
\`\`\`

## requestAnimationFrame

JS animations ke liye hamesha use karo.

\`\`\`js
function animate() {
  element.style.transform = \`translateX(\${pos}px)\`;
  requestAnimationFrame(animate);
}
\`\`\`
`,
    simple: `Smooth animations need GPU acceleration. Use \`transform\` and \`opacity\`, never animate position properties like \`left\` or layout properties. Profile with Chrome DevTools Performance tab to hit 60fps.`,
    simpleHi: `60fps ke liye \`transform\` aur \`opacity\` use karo. \`left\`, \`width\` mat animate karo. DevTools Performance tab se profile karo.`,
    tricks: `\`will-change: transform\` for hints. Profile before optimizing. \`requestAnimationFrame\` for JS animations. Box-shadow expensive hai.`,
    tricksHi: `Profile karo pehle. \`transform\` use karo. DevTools mein FPS graph dekho, smooth green line chahiye.`,
    codeExample: `<style>
/* ✓ Smooth 60fps animation */
@keyframes slideIn {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

.card {
  animation: slideIn 0.5s ease-out forwards;
  will-change: transform;
}

/* ❌ Avoid: expensive animation */
.bad {
  animation: badSlide 0.5s ease-out forwards;
}

@keyframes badSlide {
  0% { left: -100%; }
  100% { left: 0; }
}
</style>

<div class="card">Smooth animation</div>
<div class="bad">Jank animation</div>

<script>
// JS animation with rAF
let x = 0;
function animateJS() {
  x += 5;
  document.querySelector('.js-box').style.transform = \`translateX(\${x}px)\`;
  if (x < 300) requestAnimationFrame(animateJS);
}
// requestAnimationFrame(animateJS);
</script>`,
    expectedOutput: `60fps smooth animations, no jank visible in DevTools Performance profile`,
    commonMistakes: [
      'Animating position (left, top) instead of transform',
      'Not profiling to verify 60fps',
      'Abusing will-change on every animated element',
      'Using setTimeout instead of requestAnimationFrame',
    ],
    interviewQuestions: [
      'Why is transform faster than left/top?',
      'What is the difference between reflow and repaint?',
      'How do you profile animation performance?',
      'What does will-change do and when should you use it?',
    ],
    practiceQuestions: [
      'Profile an animation and identify jank causes',
      'Convert a janky position-based animation to transform-based',
      'Build a smooth parallax scroll effect',
    ],
    relatedProblemSlugs: [],
    tags: ['css', 'animations', 'performance', 'gpu', '60fps', 'optimization'],
  },

  {
    slug: 'anim-advanced-patterns',
    title: 'Advanced Animation Patterns: Award-Winning Motion',
    category: 'Advanced Patterns',
    difficulty: 'HARD',
    summary: 'Sophisticated animation patterns used in top-tier products: parallax, morphing, SVG, staggered sequences.',
    content: `## Parallax Scrolling

Create depth with layers moving at different speeds.

\`\`\`html
<style>
.parallax-container {
  perspective: 1000px;
  overflow: hidden;
  height: 100vh;
}

.parallax-layer {
  transform: translateZ(0);
  /* Faster layers move more */
}

.layer-1 {
  transform: translateZ(-100px) scale(1.1);
}
.layer-2 {
  transform: translateZ(-50px) scale(1.05);
}
.layer-3 {
  transform: translateZ(0);
}
</style>

<div class="parallax-container">
  <div class="parallax-layer layer-1">Background</div>
  <div class="parallax-layer layer-2">Middle</div>
  <div class="parallax-layer layer-3">Content</div>
</div>
\`\`\`

## SVG Morphing

Smooth shape transitions using SVG path animations.

\`\`\`html
<svg viewBox="0 0 100 100">
  <path id="shape" d="M 50 10 L 90 90 L 10 90 Z" fill="blue"/>
</svg>

<style>
#shape {
  transition: d 0.5s ease-in-out;
}
#shape.circle {
  d: path('M 50 10 C 77 10 90 23 90 50 C 90 77 77 90 50 90 C 23 90 10 77 10 50 C 10 23 23 10 50 10');
}
</style>
\`\`\`

⚠️ **Note:** \`d\` property animation limited browser support. Use SMIL or JS for better compatibility.

## Staggered Sequence (Elegant Cascade)

\`\`\`css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.item {
  animation: slideUp 0.5s ease-out forwards;
}

/* Each item delays by 50ms */
.item:nth-child(1) { animation-delay: 0ms; }
.item:nth-child(2) { animation-delay: 50ms; }
.item:nth-child(3) { animation-delay: 100ms; }
.item:nth-child(n) { animation-delay: calc(50ms * (n - 1)); }
\`\`\`

Or with CSS custom properties:
\`\`\`css
.item {
  animation: slideUp 0.5s ease-out forwards;
  animation-delay: calc(var(--index) * 50ms);
}
\`\`\`

\`\`\`html
<div style="--index: 0"></div>
<div style="--index: 1"></div>
<div style="--index: 2"></div>
\`\`\`

## Elastic/Spring-Like Motion

Using cubic-bezier for spring effect:

\`\`\`css
@keyframes elastic {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.spring {
  /* Overshoot bounce effect */
  animation: elastic 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
\`\`\`

**Useful cubic-bezier values:**
- Bounce: \`cubic-bezier(0.68, -0.55, 0.265, 1.55)\`
- Elastic: \`cubic-bezier(0.34, 1.56, 0.64, 1)\`
- Sharp ease-out: \`cubic-bezier(0.25, 0.46, 0.45, 0.94)\`

## Intersection Observer + Animation

Trigger animations when elements enter viewport:

\`\`\`js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
      observer.unobserve(entry.target); // Animate only once
    }
  });
});

document.querySelectorAll('.card').forEach(card => {
  observer.observe(card);
});
\`\`\`

\`\`\`css
.card {
  opacity: 0;
  transform: translateY(20px);
}

.card.animate {
  animation: slideUp 0.5s ease-out forwards;
}
\`\`\`

## Chained Animations

Run animations sequentially:

\`\`\`js
async function chainAnimations() {
  const box = document.querySelector('.box');

  // Animation 1
  box.style.animation = 'slideIn 0.5s forwards';
  await new Promise(r => setTimeout(r, 500));

  // Animation 2
  box.style.animation = 'rotate 0.5s forwards';
  await new Promise(r => setTimeout(r, 500));

  // Animation 3
  box.style.animation = 'fadeOut 0.5s forwards';
}

chainAnimations();
\`\`\`

Or use animation events:

\`\`\`js
const box = document.querySelector('.box');

function playNext(animationName) {
  box.style.animation = animationName;
  box.addEventListener('animationend', onAnimationEnd, { once: true });
}

function onAnimationEnd() {
  playNext('nextAnimation');
}

playNext('firstAnimation');
\`\`\`

## SVG Line Drawing (Stroke Animation)

\`\`\`html
<svg viewBox="0 0 100 100">
  <path d="M 10 10 L 90 90" stroke="black" stroke-width="2" fill="none"/>
</svg>

<style>
path {
  stroke-dasharray: 127;           /* Total path length */
  stroke-dashoffset: 127;          /* Start fully hidden */
  animation: drawLine 2s ease-out forwards;
}

@keyframes drawLine {
  to {
    stroke-dashoffset: 0;          /* Reveal the line */
  }
}
</style>
\`\`\`

## GreenSock (GSAP) Library

For complex animations, GSAP is industry standard:

\`\`\`js
gsap.to('.box', {
  duration: 1,
  x: 500,
  rotation: 360,
  opacity: 0,
  ease: 'power2.inOut',
});

// Stagger
gsap.to('.item', {
  duration: 0.5,
  y: -20,
  stagger: 0.1,
  repeat: -1,
  yoyo: true,
});

// Timeline
const tl = gsap.timeline();
tl.to('.box1', { duration: 1, x: 100 })
  .to('.box2', { duration: 1, x: 100 }, 0.5) // Start 0.5s after first
  .to('.box3', { duration: 1, x: 100 });
\`\`\`
`,
    contentHi: `## Parallax

Layers alag-alag speed se move karke depth create karo.

\`\`\`css
.layer-1 {
  transform: translateZ(-100px) scale(1.1);
}
\`\`\`

## Staggered Animations

\`\`\`css
.item {
  animation: slideUp 0.5s ease-out forwards;
  animation-delay: calc(50ms * (var(--index)));
}
\`\`\`

## Elastic Motion

\`\`\`css
animation: elastic 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
\`\`\`

## Intersection Observer

Viewport mein aaye to animate karo:

\`\`\`js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
    }
  });
});

document.querySelectorAll('.card').forEach(card => {
  observer.observe(card);
});
\`\`\`

## GSAP (GreenSock Animation Platform)

Complex animations ke liye industry standard.

\`\`\`js
gsap.to('.box', {
  duration: 1,
  x: 500,
  ease: 'power2.inOut',
});
\`\`\`
`,
    simple: `Advanced animation patterns: parallax (layers at different speeds), staggered sequences (nth-child delays), SVG morphing, IntersectionObserver (animate on scroll), and GSAP library for complex timelines.`,
    simpleHi: `Parallax, staggered animations, SVG morphing, scroll triggers, GSAP library. IntersectionObserver se viewport enter par animate karo.`,
    tricks: `Use nth-child for stagger. Intersection Observer triggers on scroll. GSAP for complex timelines. Spring effects with custom cubic-bezier.`,
    tricksHi: `nth-child stagger. IntersectionObserver scroll triggers. GSAP complex timelines. Spring effects custom cubic-bezier se.`,
    codeExample: `<style>
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.item {
  animation: slideUp 0.5s ease-out forwards;
  animation-delay: calc(100ms * var(--index, 0));
}
</style>

<div style="--index: 0" class="item">Card 1</div>
<div style="--index: 1" class="item">Card 2</div>
<div style="--index: 2" class="item">Card 3</div>

<script>
// Intersection Observer
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
    }
  });
});

document.querySelectorAll('.item').forEach(el => {
  observer.observe(el);
});
</script>`,
    expectedOutput: `Cards slide up with staggered timing, animations trigger on scroll into view`,
    commonMistakes: [
      'Staggering without understanding timing',
      'Over-animating (animation fatigue)',
      'Not using IntersectionObserver for scroll animations',
      'Ignoring performance with complex SVG animations',
    ],
    interviewQuestions: [
      'How do you create a staggered animation effect?',
      'Explain Intersection Observer for scroll-triggered animations',
      'What is parallax scrolling and how do you implement it?',
      'When should you use GSAP vs CSS animations?',
    ],
    practiceQuestions: [
      'Build a staggered card reveal animation',
      'Implement a parallax scrolling section',
      'Create an Intersection Observer animation trigger',
      'Build an SVG line drawing animation',
    ],
    relatedProblemSlugs: [],
    tags: ['css', 'animations', 'advanced', 'scroll', 'intersection-observer', 'svg', 'gsap'],
  },
];
