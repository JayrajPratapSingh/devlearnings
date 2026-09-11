import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * A magnetic hover: the element leans toward the cursor within its own
 * bounds, then springs back on leave. One of the smallest, most reliable
 * "this was designed, not defaulted" signals a primary action can carry.
 *
 * `strength` is how much of the cursor's offset the element actually travels
 * (0.3 = drifts 30% of the way toward the pointer). Kept well under 1 so the
 * element never actually reaches the cursor — it should feel attracted, not
 * chased.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.35) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      xTo(relX * strength);
      yTo(relY * strength);
    };

    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [strength]);

  return ref;
}

/**
 * A soft radial glow that tracks the cursor within a container — the
 * "spotlight" effect. Returns a ref for the container and a ref for the glow
 * element itself (an absolutely-positioned div the caller renders).
 */
export function useCursorSpotlight<C extends HTMLElement, G extends HTMLElement>() {
  const containerRef = useRef<C | null>(null);
  const glowRef = useRef<G | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const glow = glowRef.current;
    if (!container || !glow) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const xTo = gsap.quickTo(glow, 'x', { duration: 0.7, ease: 'power3.out' });
    const yTo = gsap.quickTo(glow, 'y', { duration: 0.7, ease: 'power3.out' });

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      xTo(e.clientX - rect.left);
      yTo(e.clientY - rect.top);
    };

    container.addEventListener('mousemove', onMove);
    return () => container.removeEventListener('mousemove', onMove);
  }, []);

  return { containerRef, glowRef };
}
