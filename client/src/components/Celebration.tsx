import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  spin: number;
  angle: number;
  life: number;
}

/**
 * Confetti burst for an accepted submission.
 *
 * Drawn on a canvas rather than as DOM nodes — 120 animated elements would
 * thrash layout, whereas a canvas is one composited layer. The whole thing is a
 * pointer-events-none overlay, so it never blocks the button underneath, and it
 * self-destructs when the particles die.
 *
 * Skipped entirely under prefers-reduced-motion.
 */
export function Celebration({ fire, onDone }: { fire: boolean; onDone?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!fire) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      onDone?.();
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Brand + difficulty colours, so the burst belongs to this app.
    const colors = ['#6366f1', '#2db884', '#e3a93c', '#0ea5e9', '#a855f7'];
    const particles: Particle[] = [];

    // Two side cannons read as "celebration" rather than "something fell over".
    for (const origin of [0.15, 0.85]) {
      for (let i = 0; i < 60; i += 1) {
        const angle = (Math.random() * Math.PI) / 2 + (origin < 0.5 ? -Math.PI / 4 : -Math.PI * 0.75);
        const speed = 6 + Math.random() * 7;
        particles.push({
          x: width * origin,
          y: height * 0.62,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 4,
          size: 5 + Math.random() * 5,
          color: colors[Math.floor(Math.random() * colors.length)] ?? '#6366f1',
          spin: (Math.random() - 0.5) * 0.3,
          angle: Math.random() * Math.PI,
          life: 1,
        });
      }
    }

    const tick = (): void => {
      ctx.clearRect(0, 0, width, height);
      let alive = false;

      for (const p of particles) {
        if (p.life <= 0) continue;
        alive = true;

        p.vy += 0.28; // gravity
        p.vx *= 0.99; // drag
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.spin;
        p.life -= 0.011;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        // Rectangles tumbling in 3D read as paper; circles read as bubbles.
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      }

      if (alive) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, width, height);
        onDone?.();
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [fire, onDone]);

  if (!fire) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[60] h-full w-full"
      aria-hidden="true"
    />
  );
}
