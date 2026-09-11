import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { cx } from './ui';
import { useCursorSpotlight } from '../hooks/useMagnetic';

/**
 * The left half of the auth screen — a looping tour of what the app actually does.
 *
 * Three scenes, each a real product moment rather than a stock illustration:
 * you solve, you revise in either language, you watch the numbers move. Someone
 * landing here understands the product before reading a line of copy.
 *
 * Every scene animates from one interval or a CSS transition — no per-frame React
 * state churn — and the whole thing degrades to a static final frame under
 * prefers-reduced-motion.
 */

const SOLUTION = `def two_sum(arr, target):
    seen = {}
    for i, x in enumerate(arr):
        if target - x in seen:
            return [seen[target - x], i]
        seen[x] = i`;

const STATS = [
  { value: '41', label: 'DSA problems' },
  { value: '62', label: 'topics' },
  { value: '34', label: 'interview Qs' },
  { value: '3', label: 'languages' },
];

const SCENES = [
  { id: 'solve', label: 'Solve', ms: 9000 },
  { id: 'revise', label: 'Revise', ms: 7000 },
  { id: 'track', label: 'Track', ms: 6500 },
] as const;

type SceneId = (typeof SCENES)[number]['id'];

function useReducedMotion(): boolean {
  return useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );
}

/* ───────────────────────────── Scene 1 — Solve ───────────────────────────── */

function SolveScene({ reduced }: { reduced: boolean }) {
  const [typed, setTyped] = useState(reduced ? SOLUTION.length : 0);
  const [phase, setPhase] = useState<'typing' | 'running' | 'accepted'>(
    reduced ? 'accepted' : 'typing',
  );

  useEffect(() => {
    if (reduced) return;
    let cancelled = false;
    const timers: number[] = [];

    setTyped(0);
    setPhase('typing');

    const interval = window.setInterval(() => {
      setTyped((n) => {
        if (n >= SOLUTION.length) {
          window.clearInterval(interval);
          timers.push(
            window.setTimeout(() => {
              if (cancelled) return;
              setPhase('running');
              timers.push(
                window.setTimeout(() => {
                  if (!cancelled) setPhase('accepted');
                }, 850),
              );
            }, 550),
          );
          return n;
        }
        return n + 1;
      });
    }, 26);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [reduced]);

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-2xl">
      <div className="flex items-center gap-2 border-b border-line px-3 py-2">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-hard/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-medium/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-easy/70" />
        </span>
        <span className="ml-1 font-mono text-[11px] text-content-subtle">two_sum.py</span>
        <span className="ml-auto rounded bg-surface-sunken px-1.5 py-0.5 font-mono text-[10px] text-content-subtle">
          Python
        </span>
      </div>

      <pre className="h-[148px] overflow-hidden px-4 py-3 font-mono text-[12.5px] leading-6 text-content">
        <code>
          {SOLUTION.slice(0, typed)}
          {phase === 'typing' && !reduced && (
            <span className="ml-px inline-block h-[14px] w-[7px] translate-y-[2px] animate-pulse bg-brand" />
          )}
        </code>
      </pre>

      <div className="flex items-center gap-2 border-t border-line px-3 py-2">
        {phase === 'accepted' ? (
          <span className="animate-pop-in inline-flex items-center gap-1.5 rounded-md bg-easy/15 px-2 py-1 text-[11px] font-semibold text-easy">
            ✓ Accepted · 6/6 test cases
          </span>
        ) : phase === 'running' ? (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-medium/15 px-2 py-1 text-[11px] font-semibold text-medium">
            <span className="h-2 w-2 animate-pulse rounded-full bg-medium" />
            Running test cases…
          </span>
        ) : (
          <span className="font-mono text-[11px] text-content-subtle">writing solution…</span>
        )}
        <span className="ml-auto font-mono text-[10px] text-content-subtle">
          {phase === 'accepted' ? '48ms' : '—'}
        </span>
      </div>
    </div>
  );
}

/* ──────────────────────────── Scene 2 — Revise ───────────────────────────── */

const CONCEPT = {
  title: 'Closures',
  en: 'A closure is a function plus the lexical environment it was created in — outer variables stay alive after the outer function returns.',
  hi: 'Closure matlab function + wo lexical environment jisme wo bana tha — outer function return hone ke baad bhi outer variables zinda rehte hain.',
};

function ReviseScene({ reduced }: { reduced: boolean }) {
  // The language flip is the point of this scene — it shows the bilingual
  // feature working rather than claiming it in a bullet list.
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setLang((l) => (l === 'en' ? 'hi' : 'en')), 2600);
    return () => window.clearInterval(id);
  }, [reduced]);

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-2xl">
      <div className="flex items-center gap-2 border-b border-line px-3 py-2">
        <span className="rounded bg-hard/15 px-1.5 py-0.5 text-[10px] font-semibold text-hard">
          DUE TODAY
        </span>
        <span className="font-mono text-[11px] text-content-subtle">JavaScript</span>
        <span className="ml-auto flex overflow-hidden rounded border border-line" aria-hidden="true">
          {(['en', 'hi'] as const).map((code) => (
            <span
              key={code}
              className={cx(
                'px-1.5 py-0.5 text-[10px] font-semibold transition-colors duration-300',
                lang === code ? 'bg-brand text-surface' : 'text-content-subtle',
              )}
            >
              {code.toUpperCase()}
            </span>
          ))}
        </span>
      </div>

      <div className="h-[148px] px-4 py-3">
        <p className="text-[15px] font-semibold text-content">{CONCEPT.title}</p>
        <p
          key={lang}
          className={cx('mt-2 text-[13px] leading-6 text-content-muted', !reduced && 'animate-fade-up')}
        >
          {lang === 'en' ? CONCEPT.en : CONCEPT.hi}
        </p>
      </div>

      <div className="flex items-center gap-1.5 border-t border-line px-3 py-2">
        {[
          { label: 'Forgot', cls: 'bg-hard/15 text-hard' },
          { label: 'Shaky', cls: 'bg-surface-sunken text-content-muted' },
          { label: 'Solid', cls: 'bg-easy/15 text-easy' },
        ].map((b) => (
          <span key={b.label} className={cx('rounded-md px-2 py-1 text-[11px] font-medium', b.cls)}>
            {b.label}
          </span>
        ))}
        <span className="ml-auto font-mono text-[10px] text-content-subtle">next in 6d</span>
      </div>
    </div>
  );
}

/* ───────────────────────────── Scene 3 — Track ───────────────────────────── */

function TrackScene({ reduced }: { reduced: boolean }) {
  const [pct, setPct] = useState(reduced ? 68 : 0);
  const [solved, setSolved] = useState(reduced ? 28 : 0);

  useEffect(() => {
    if (reduced) return;
    setPct(0);
    setSolved(0);
    const start = performance.now();
    let raf = 0;

    const tick = (now: number): void => {
      const t = Math.min(1, (now - start) / 1400);
      const eased = 1 - Math.pow(1 - t, 3);
      setPct(Math.round(68 * eased));
      setSolved(Math.round(28 * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  const size = 92;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  const bars = [
    { label: 'JavaScript', v: 83 },
    { label: 'SQL', v: 61 },
    { label: 'Node.js', v: 44 },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface p-4 shadow-2xl">
      <div className="flex items-center gap-5">
        <div className="relative shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgb(var(--surface-sunken))" strokeWidth={stroke} />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke="rgb(var(--brand))"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={c - (pct / 100) * c}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-lg font-semibold tabular-nums text-content">{pct}%</span>
            <span className="text-[9px] uppercase tracking-wider text-content-subtle">ready</span>
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          {bars.map((b, i) => (
            <div key={b.label}>
              <div className="mb-1 flex justify-between text-[11px]">
                <span className="text-content-muted">{b.label}</span>
                <span className="font-mono tabular-nums text-content-subtle">{b.v}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-surface-sunken">
                <div
                  className="h-full rounded-full bg-brand"
                  style={{
                    width: reduced ? `${b.v}%` : `${(pct / 68) * b.v}%`,
                    transitionDelay: `${i * 80}ms`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-line pt-3">
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-medium/10 px-2 py-1 text-[11px] font-semibold text-medium">
          <span className={cx(!reduced && 'inline-block animate-flicker')} aria-hidden="true">🔥</span>
          12 day streak
        </span>
        <span className="rounded-lg bg-surface-sunken px-2 py-1 text-[11px] text-content-muted">
          <span className="font-mono font-semibold text-content tabular-nums">{solved}</span> solved
        </span>
        <span className="ml-auto font-mono text-[10px] text-content-subtle">accuracy 74%</span>
      </div>
    </div>
  );
}

/* ────────────────────────────── The showcase ─────────────────────────────── */

const COPY: Record<SceneId, { eyebrow: string; title: string; body: string }> = {
  solve: {
    eyebrow: 'Solve',
    title: 'Code likho, browser mein hi chalao.',
    body: 'JavaScript, Node.js aur Python — sandbox ke andar, timeout aur memory limit ke saath.',
  },
  revise: {
    eyebrow: 'Revise',
    title: 'English ya Hinglish — jo jaldi samajh aaye.',
    body: 'Jo galat hua wo apne aap revision queue mein aata hai, sahi time par wapas dikhta hai.',
  },
  track: {
    eyebrow: 'Track',
    title: 'Pata rahe kahan kamzor ho.',
    body: 'Har technology ka progress, accuracy, streak aur weak areas — ek dashboard par.',
  },
};

/**
 * Splits text into one <span> per word so GSAP can stagger them in — a small
 * hand-rolled substitute for the (paid) SplitText plugin. Words, not letters:
 * word-level stagger already reads as deliberate typography and keeps the
 * bilingual copy from ever cracking mid-syllable.
 */
function SplitWords({ text, className }: { text: string; className?: string }) {
  const words = text.split(' ');
  return (
    <span className={className} style={{ textWrap: 'balance' }}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <span className="split-word inline-block">
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        </span>
      ))}
    </span>
  );
}

export function AuthShowcase() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const timer = useRef<number>(0);
  const headlineRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const { containerRef, glowRef } = useCursorSpotlight<HTMLDivElement, HTMLDivElement>();

  const scene = SCENES[index] ?? SCENES[0];

  const advance = useCallback(() => {
    setIndex((i) => (i + 1) % SCENES.length);
  }, []);

  useEffect(() => {
    if (reduced) return;
    timer.current = window.setTimeout(advance, scene.ms);
    return () => window.clearTimeout(timer.current);
  }, [index, advance, reduced, scene.ms]);

  // Headline + scene panel animate in together on every scene change — a
  // GSAP timeline rather than a CSS class remount, so the words stagger and
  // the scene settles with a shared, tunable ease instead of two unrelated
  // transitions firing at once.
  //
  // GSAP's tween progression rides on requestAnimationFrame, which a
  // background/unfocused tab can starve indefinitely — a tween created there
  // renders its `fromTo` start state and then simply never advances. Rather
  // than risk the headline sitting invisible until the tab is focused, an
  // unfocused document skips straight to the end state.
  useEffect(() => {
    const words = headlineRef.current?.querySelectorAll<HTMLElement>('.split-word');
    const scenePanel = sceneRef.current;

    if (reduced || !document.hasFocus()) {
      if (words?.length) gsap.set(words, { yPercent: 0, rotate: 0 });
      if (scenePanel) gsap.set(scenePanel, { opacity: 1, y: 0, scale: 1 });
      return;
    }

    const tl = gsap.timeline();
    if (words?.length) {
      tl.fromTo(
        words,
        { yPercent: 115, rotate: 4 },
        { yPercent: 0, rotate: 0, duration: 0.7, ease: 'power4.out', stagger: 0.045 },
        0,
      );
    }
    if (scenePanel) {
      tl.fromTo(
        scenePanel,
        { opacity: 0, y: 18, scale: 0.985 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' },
        0.1,
      );
    }
    return () => {
      tl.kill();
    };
  }, [index, reduced]);

  const copy = COPY[scene.id];

  return (
    <div
      ref={containerRef}
      className="relative hidden overflow-hidden border-r border-line bg-surface-sunken lg:flex lg:w-[54%] lg:flex-col lg:justify-center"
    >
      {/* Fine grid — a schematic, not decoration. Denser and sharper than a
          dot-wash so the panel reads as instrument-panel precision. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(rgb(var(--line)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--line)) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 90%)',
        }}
      />
      {/* Cursor-tracked spotlight — the panel responds to the visitor, not
          just the timer. */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute h-[460px] w-[460px] rounded-full opacity-[0.14] blur-[110px]"
        style={{ background: 'rgb(var(--brand))', left: -230, top: -230 }}
      />
      {/* Ambient scene glow — slower, larger, gives the panel a baseline pulse
          even when the cursor is elsewhere. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute h-[520px] w-[520px] rounded-full opacity-[0.1] blur-[130px] transition-all duration-[1400ms] ease-out"
        style={{
          background: 'rgb(var(--accent))',
          left: index === 0 ? '-10%' : index === 1 ? '44%' : '18%',
          top: index === 0 ? '60%' : index === 1 ? '70%' : '55%',
        }}
      />

      {/* Persistent status strip — the "instrument panel" is always live, even
          between scene transitions. */}
      <div className="absolute left-0 right-0 top-0 z-10 flex items-center gap-2 border-b border-line/80 px-8 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-content-subtle xl:px-10">
        <span className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_8px_rgb(var(--brand))]" />
        devprep · sandbox online
        <span className="ml-auto tabular-nums">{scene.id}.exec</span>
      </div>

      <div className="relative z-10 px-8 xl:px-10">
        <p className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-brand">
          {String(index + 1).padStart(2, '0')} / {copy.eyebrow}
        </p>
        <div ref={headlineRef}>
          <SplitWords
            key={`${scene.id}-title`}
            text={copy.title}
            className="block max-w-lg font-display text-[36px] font-semibold leading-[1.15] tracking-[-0.015em] text-content xl:text-[42px]"
          />
        </div>
        <p
          key={`${scene.id}-body`}
          className={cx('mt-4 max-w-md text-[14.5px] leading-6 text-content-muted', !reduced && 'animate-fade-up')}
        >
          {copy.body}
        </p>

        <div ref={sceneRef} className="mt-7 max-w-md" key={scene.id}>
          {scene.id === 'solve' && <SolveScene reduced={reduced} />}
          {scene.id === 'revise' && <ReviseScene reduced={reduced} />}
          {scene.id === 'track' && <TrackScene reduced={reduced} />}
        </div>

        {/* Scene switcher — labelled, because unlabelled dots tell you nothing */}
        <div className="mt-6 flex max-w-md items-center gap-2">
          {SCENES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setIndex(i)}
              className={cx(
                'relative rounded-md px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-wide transition-all',
                i === index
                  ? 'bg-brand text-surface shadow-[0_0_16px_-2px_rgb(var(--brand)/0.6)]'
                  : 'text-content-subtle hover:bg-surface-raised hover:text-content',
              )}
              aria-current={i === index}
            >
              {s.label}
            </button>
          ))}

          <div className="ml-auto flex gap-6">
            {STATS.slice(0, 2).map((s) => (
              <div key={s.label} className="text-right">
                <span className="font-mono text-[15px] font-semibold tabular-nums text-content">
                  {s.value}
                </span>
                <span className="ml-1.5 text-[10px] uppercase tracking-wider text-content-subtle">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Compact version for narrow screens, where the tour panel is hidden. */
export function AuthStatStrip() {
  return (
    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 lg:hidden">
      {STATS.map((s) => (
        <div key={s.label} className="text-center">
          <p className="font-mono text-[15px] font-semibold tabular-nums text-content">{s.value}</p>
          <p className="text-[10px] uppercase tracking-wider text-content-subtle">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
