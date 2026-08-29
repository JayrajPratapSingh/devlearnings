import type { SeedCategory } from './topics-shared';

export const animationsCategory: SeedCategory = {
  slug: 'animations',
  name: 'CSS & Web Animations',
  description: 'Smooth transitions, complex keyframes, 60fps performance, and award-winning animation patterns.',
  icon: 'sparkles',
  group: 'web-dev',
  topics: [
    {
      slug: 'anim-css-transitions',
      title: 'CSS Transitions: Smooth State Changes',
      difficulty: 'EASY',
      summary: 'Smooth property changes from one state to another. The foundation of micro-interactions.',
      summaryHi: 'Transitions state change ko smooth karte hain. Hover mein animation auto.',
      content: `CSS Transitions smoothly animate property changes.

Properties:
- transition-property: which properties to animate (background, transform, opacity)
- transition-duration: how long (300ms, 0.3s)
- transition-timing-function: easing (ease, ease-out, ease-in, linear, cubic-bezier)
- transition-delay: delay before starting
- Shorthand: transition: property duration timing delay

Timing functions:
- ease: smooth (default)
- ease-out: fast start, slow end (best for enter animations)
- ease-in: slow start, fast end (best for exit animations)
- linear: constant speed
- cubic-bezier: custom curves

Performance:
Use ONLY transform and opacity for smooth 60fps.
Avoid: width, height, left, top, padding, margin (causes reflow).

Button Hover Example:
button { transition: all 0.2s ease-out; }
button:hover { transform: translateY(-2px); box-shadow: 0 4px 8px; }`,
      contentHi: `Transitions smooth karte hain.

transition: property duration timing delay

Timing: ease, ease-out, ease-in, linear

Performance: transform aur opacity use karo, width/left nahi.`,
      codeExample: `button { transition: all 0.2s ease-out; }
button:hover { transform: translateY(-2px); }`,
      expectedOutput: `Smooth button effect on hover`,
      commonMistakes: [
        'Using transition on width/height',
        'Wrong timing function',
        'Not using transform for position'
      ],
      interviewQuestions: [
        'How do CSS transitions work?',
        'Difference between ease-in and ease-out?',
        'Why use transform instead of left/top?'
      ],
      practiceQuestions: [
        'Create smooth button hover',
        'Build modal fade animation'
      ],
      tags: ['css', 'transitions', 'animations', 'micro-interactions'],
    },
    {
      slug: 'anim-css-keyframes',
      title: 'CSS Keyframes: Complex Animations',
      difficulty: 'MEDIUM',
      summary: 'Define multi-step animations with keyframes. Loops, repeats, and intricate motion patterns.',
      summaryHi: 'Keyframes multi-step animations define karte hain. Loops aur infinite animations.',
      content: `Keyframes define animation stages from 0% to 100%.

Syntax:
@keyframes nameAnimation {
  0% { properties at start }
  50% { properties at middle }
  100% { properties at end }
}

Animation Properties:
- animation-name: which keyframes to use
- animation-duration: how long
- animation-timing-function: easing
- animation-delay: delay before starting
- animation-iteration-count: how many times (1, 3, infinite)
- animation-direction: normal, reverse, alternate, alternate-reverse
- animation-fill-mode: forwards (stay at 100%), backwards, both, none
- animation-play-state: running, paused

Common Patterns:
1. Bounce: 0% and 100% same position, 50% moved
2. Spin: 0% rotate(0deg), 100% rotate(360deg)
3. Stagger: use animation-delay on nth-child elements
4. Fade: 0% opacity 0, 100% opacity 1

Staggered Animation:
.card { animation: slideIn 0.5s ease-out forwards; }
.card:nth-child(1) { animation-delay: 0s; }
.card:nth-child(2) { animation-delay: 0.1s; }
.card:nth-child(3) { animation-delay: 0.2s; }`,
      contentHi: `Keyframes multi-step define karte hain.

@keyframes slideIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

animation-iteration-count: infinite (loop)
animation-direction: alternate (smooth loop)
animation-fill-mode: forwards (stay at end)`,
      codeExample: `@keyframes bounce { 0%, 100% { transform: y(0); } 50% { transform: translateY(-10px); } }
.box { animation: bounce 1s infinite; }`,
      expectedOutput: `Bouncing animation loops smoothly`,
      commonMistakes: [
        'Not using animation-fill-mode: forwards',
        'Not using transform',
        'Infinite loops blocking interaction'
      ],
      interviewQuestions: [
        'How do keyframes work?',
        'Explain animation-direction: alternate',
        'What does animation-fill-mode do?'
      ],
      practiceQuestions: [
        'Create loading spinner',
        'Build bounce animation',
        'Implement staggered reveal'
      ],
      tags: ['css', 'keyframes', 'animations', 'loops'],
    },
    {
      slug: 'anim-performance-optimization',
      title: 'Animation Performance: 60fps Smooth',
      difficulty: 'HARD',
      summary: 'Achieve butter-smooth 60fps animations. GPU acceleration, jank elimination, and profiling.',
      summaryHi: '60fps smooth animations. Transform aur opacity use karo. DevTools se profile karo.',
      content: `60 frames per second (fps) = 16.67ms per frame. Missing one frame = visible stutter.

GPU-Accelerated Properties (FAST):
- transform (translateX, translateY, rotate, scale, skew)
- opacity

Non-Accelerated Properties (SLOW - cause reflow):
- width, height
- left, right, top, bottom (position)
- padding, margin
- border

Why transform is fast: GPU handles it independently, no layout recalculation.
Why left/top is slow: browser must recalculate layout for every frame.

Enable GPU Acceleration:
- transform: translateZ(0) forces GPU
- will-change: transform (tells browser this will animate)

Performance Profiling (Chrome DevTools):
1. Performance tab
2. Record
3. Interact with animation
4. Stop recording
5. Check FPS graph (should be smooth green line at 60fps)

Common Performance Pitfalls:
- Animating background-position (expensive)
- Animating box-shadow (expensive)
- Not batching updates
- Using setTimeout instead of requestAnimationFrame

requestAnimationFrame (rAF):
- Syncs with monitor refresh rate
- Pauses when tab is hidden (saves battery)
- Throttled to one call per frame
- Always use for JS animations`,
      contentHi: `60fps = 16.67ms per frame.

GPU Properties: transform, opacity (FAST)
Slow Properties: width, left, top, padding (cause reflow)

DevTools: Performance tab → record → animate → check FPS

rAF use karo JS animations ke liye.`,
      codeExample: `element.style.transform = "translateX(100px)"; /* Fast */
element.style.left = "100px"; /* Slow */`,
      expectedOutput: `60fps smooth animation`,
      commonMistakes: [
        'Animating position instead of transform',
        'Not profiling before optimizing',
        'Abusing will-change'
      ],
      interviewQuestions: [
        'Why is transform faster than left/top?',
        'What is reflow vs repaint?',
        'How to profile animation performance?'
      ],
      practiceQuestions: [
        'Profile animation for jank',
        'Convert janky animation to transform',
        'Implement smooth scroll effect'
      ],
      tags: ['css', 'animations', 'performance', 'gpu', '60fps'],
    },
    {
      slug: 'anim-advanced-patterns',
      title: 'Advanced Animation Patterns: Award-Winning Motion',
      difficulty: 'HARD',
      summary: 'Sophisticated animation patterns: parallax, staggering, morphing, SVG, scroll triggers, GSAP.',
      summaryHi: 'Parallax, staggered animations, SVG morphing, IntersectionObserver, GSAP library.',
      content: `Advanced animation patterns for award-winning interactions:

1. PARALLAX SCROLLING
Create depth with layers moving at different speeds using transform translateZ().

2. STAGGERED SEQUENCES
Sequential animations where each element animates with a delay:
animation-delay: calc(var(--index) * 50ms)
Apply --index CSS variable to each element.

3. ELASTIC/SPRING EFFECTS
Use custom cubic-bezier values for spring motion:
cubic-bezier(0.34, 1.56, 0.64, 1) for elastic effect
cubic-bezier(0.68, -0.55, 0.265, 1.55) for bounce

4. INTERSECTION OBSERVER
Trigger animations when elements enter viewport:
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('animate');
  });
});

5. SVG ANIMATIONS
Line drawing effect using stroke-dasharray and stroke-dashoffset:
path { stroke-dasharray: 100; stroke-dashoffset: 100; }
animation: draw 2s ease-out forwards;

6. GSAP (GreenSock Animation Platform)
Industry standard for complex timelines:
gsap.to('.box', { duration: 1, x: 500, ease: 'power2.inOut' });
Stagger: gsap.to('.item', { duration: 0.5, y: -20, stagger: 0.1 });
Timeline: gsap.timeline().to(...).to(...).to(...)

Tips for Award-Winning Animations:
- Smooth easing (avoid linear)
- Purposeful motion (not just decorative)
- Performance-focused (60fps)
- Respects prefers-reduced-motion
- Timing feels natural`,
      contentHi: `Parallax: layers alag-alag speed se move
Staggered: animation-delay use karo
Elastic: custom cubic-bezier
IntersectionObserver: scroll triggers
SVG: stroke-dasharray animation
GSAP: complex timelines

Award-winning: smooth, purposeful, performant.`,
      codeExample: `.item { animation: slideUp 0.5s forwards; animation-delay: calc(100ms * var(--index)); }

const observer = new IntersectionObserver(e => {
  e.forEach(en => { if (en.isIntersecting) en.target.classList.add('animate'); });
});`,
      expectedOutput: `Sophisticated animations trigger on scroll and stagger`,
      commonMistakes: [
        'Over-animating (animation fatigue)',
        'Not using IntersectionObserver',
        'Ignoring performance with SVG'
      ],
      interviewQuestions: [
        'How to create staggered animations?',
        'Explain IntersectionObserver for scroll?',
        'What is parallax scrolling?',
        'When to use GSAP vs CSS?'
      ],
      practiceQuestions: [
        'Build staggered card reveal',
        'Implement parallax section',
        'Create scroll-triggered animations',
        'Build SVG line drawing',
        'Create complex GSAP timeline'
      ],
      tags: ['css', 'animations', 'advanced', 'scroll', 'intersection-observer', 'svg', 'gsap', 'award-winning'],
    },
  ],
};
