import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Generic entrance: every `[data-in]` descendant of the returned ref fades
 * and lifts in, staggered in DOM order. One primitive reused across pages
 * (auth, dashboard, …) so "how this app arrives" stays a single decision
 * instead of a per-page reinvention.
 *
 * Skips straight to the visible end state for reduced motion AND for an
 * unfocused document — GSAP's tweens ride on requestAnimationFrame, which a
 * background tab can starve indefinitely, and content must never be the one
 * waiting on that to become visible.
 */
export function useStaggerIn<T extends HTMLElement>(deps: unknown[] = []) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll('[data-in]');
    if (!targets.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !document.hasFocus()) {
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }

    const tween = gsap.fromTo(
      targets,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.05 },
    );
    return () => {
      tween.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
