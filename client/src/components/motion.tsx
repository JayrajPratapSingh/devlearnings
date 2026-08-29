import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { cx } from './ui';

/**
 * The app's motion vocabulary.
 *
 * Deliberately built on CSS transitions and IntersectionObserver rather than an
 * animation library. Everything here is a single transform-and-opacity change
 * on the compositor — GSAP would add ~25 KB to do the same job, and this is a
 * tool people use daily, where a fast first paint matters more than a timeline
 * API we would use for four effects.
 *
 * Every component here no-ops under prefers-reduced-motion. That is not a
 * courtesy — interpolated movement is a genuine accessibility problem.
 */

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

/* ───────────────────────────── Page transition ───────────────────────────── */

/**
 * Cross-fades the page on navigation.
 *
 * Keyed on the pathname so React remounts the subtree, which restarts the
 * animation. Kept short (180ms) and opacity-only with a small lift: a long or
 * sliding page transition makes an app feel slower, not richer.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();
  const reduced = usePrefersReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <div key={location.pathname} className="animate-page-in">
      {children}
    </div>
  );
}

/* ──────────────────────────── Scroll reveal ─────────────────────────────── */

/**
 * Fades content in as it enters the viewport.
 *
 * One shared IntersectionObserver rather than one per element — a page with 40
 * cards would otherwise create 40 observers. Elements unobserve themselves once
 * revealed, because re-animating on scroll-up is distracting.
 */
const revealed = new WeakSet<Element>();
let observer: IntersectionObserver | null = null;

function reveal(el: Element): void {
  el.classList.add('is-revealed');
  revealed.add(el);
  observer?.unobserve(el);
}

function getObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === 'undefined') return null;
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) reveal(entry.target);
      }
    },
    // Start slightly before the element is fully on screen, so it has finished
    // animating by the time the reader's eye reaches it.
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
  );
  return observer;
}

/**
 * Reveal everything, unconditionally.
 *
 * A decorative animation must never be able to hide content permanently, and
 * IntersectionObserver has several ways of never firing — a hidden tab, a
 * print job, an embedded webview, an element inside a container that never
 * intersects. Any of those would leave the page blank at `opacity: 0`.
 * So a fade-in always gets a deadline.
 */
function revealAll(): void {
  document.querySelectorAll('.reveal:not(.is-revealed)').forEach(reveal);
}

if (typeof window !== 'undefined') {
  // Printing does not scroll, so nothing would ever intersect.
  window.addEventListener('beforeprint', revealAll);
}

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  /** Milliseconds. Used to stagger siblings. */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    if (revealed.has(el)) {
      el.classList.add('is-revealed');
      return;
    }

    const io = getObserver();
    if (!io) {
      // No IntersectionObserver at all — show it rather than hide it.
      reveal(el);
      return;
    }

    io.observe(el);

    // Deadline. If the observer has not fired by now — hidden tab, webview,
    // a container that never intersects — show the content anyway. Late is
    // fine; invisible is not.
    const deadline = window.setTimeout(() => reveal(el), 900 + delay);

    return () => {
      window.clearTimeout(deadline);
      io.unobserve(el);
    };
  }, [reduced, delay]);

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <div ref={ref} className={cx('reveal', className)} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/**
 * Staggers a list so items arrive in sequence rather than all at once.
 *
 * The stagger is capped: beyond ~10 items the delay stops growing, otherwise
 * the 40th row of a list would wait 1.6 seconds to appear, which reads as a
 * bug rather than a flourish.
 */
export function Stagger({
  children,
  step = 45,
  max = 10,
  className,
}: {
  children: ReactNode[];
  step?: number;
  max?: number;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const items = useMemo(() => children.filter(Boolean), [children]);

  if (reduced) return <div className={className}>{items}</div>;

  return (
    <div className={className}>
      {items.map((child, i) => (
        <Reveal key={i} delay={Math.min(i, max) * step}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}
