import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

/**
 * Smooth page scrolling.
 *
 * Lenis intercepts wheel events and interpolates the scroll position, which is
 * the one thing CSS genuinely cannot do — `scroll-behavior: smooth` only affects
 * programmatic jumps, not the wheel.
 *
 * Two things it must not break, and both are handled here:
 *
 *  - **Inner scroll areas.** The problem workspace, the output panel and Monaco
 *    all scroll independently. Lenis only owns the window; anything marked
 *    `data-lenis-prevent` keeps its native scrolling.
 *  - **Reduced motion.** Interpolated scrolling is exactly the kind of movement
 *    people disable for motion sensitivity, so it is not started at all.
 */
/**
 * The running Lenis instance, or null when smooth scrolling is off.
 *
 * Module-level rather than context because the only thing outside the hook that
 * needs it is `scrollToElement`, and threading a provider through the tree for
 * one imperative call would be more machinery than the problem deserves.
 */
let activeLenis: Lenis | null = null;

export function useSmoothScroll(): void {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Coarse pointers already have momentum scrolling from the OS; adding our
    // own on top feels laggy rather than smooth.
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const lenis = new Lenis({
      duration: 0.9,
      // Slightly weighted ease-out: quick response, gentle settle. A longer
      // duration reads as sluggish in a tool people use every day.
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      autoRaf: false,
    });

    lenisRef.current = lenis;
    activeLenis = lenis;

    let frame = 0;
    const raf = (time: number): void => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisRef.current = null;
      activeLenis = null;
    };
  }, []);
}

/**
 * Jumps to the top when the route changes.
 *
 * Without this a smooth-scrolled page keeps its offset across navigation, so a
 * new page opens halfway down. `immediate` skips the animation — animating a
 * page you have not seen yet is disorienting, not smooth.
 */
export function scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
}

/**
 * Scrolls an element into view, going through Lenis when it is running.
 *
 * Native `scrollIntoView({ behavior: 'smooth' })` does nothing while Lenis is
 * active: Lenis drives the scroll position from its own rAF loop every frame,
 * so it overwrites the browser's animation immediately and the page never
 * moves. Anything that needs to scroll programmatically has to ask Lenis.
 *
 * When Lenis is off — reduced motion, or a touch device where the OS already
 * provides momentum — the native path is correct, and reduced motion gets an
 * instant jump rather than an animation it asked not to see.
 *
 * A hidden tab gets an instant jump too. Both Lenis and native smooth scrolling
 * are driven by rAF, which browsers do not run for a background tab — so an
 * animated scroll requested there simply never happens, and the page is still
 * at the top when the user switches to it.
 */
export function scrollToElement(el: HTMLElement): void {
  if (document.hidden) {
    const y = el.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top: Math.max(y, 0), behavior: 'instant' as ScrollBehavior });
    return;
  }

  if (activeLenis) {
    activeLenis.scrollTo(el, { offset: -120, duration: 0.8 });
    return;
  }

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
}
