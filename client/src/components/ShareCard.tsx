import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, cx } from './ui';

export interface ShareStats {
  name: string;
  overall: number;
  solved: number;
  totalProblems: number;
  topicsKnown: number;
  accuracy: number;
  streak: number;
  longestStreak: number;
}

/**
 * Generates a shareable progress image.
 *
 * Drawn on a canvas rather than screenshotted, so it is a deliberate composition
 * at a fixed 1200×630 — the size link previews expect — instead of whatever the
 * viewport happened to be.
 *
 * Colours are read from the live CSS tokens, so the card matches whichever theme
 * the app is in rather than hardcoding a palette that drifts.
 */
export function ShareCard({ stats, open, onClose }: { stats: ShareStats; open: boolean; onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const W = 1200;
    const H = 630;
    canvas.width = W;
    canvas.height = H;

    const css = getComputedStyle(document.documentElement);
    const token = (name: string, alpha = 1) => {
      const raw = css.getPropertyValue(name).trim();
      return `rgba(${raw.split(/\s+/).join(', ')}, ${alpha})`;
    };

    const surface = token('--surface');
    const raised = token('--surface-raised');
    const line = token('--line');
    const content = token('--content');
    const muted = token('--content-muted');
    const brand = token('--brand');

    ctx.fillStyle = surface;
    ctx.fillRect(0, 0, W, H);

    // Brand glow, matching the auth screen's treatment.
    const glow = ctx.createRadialGradient(180, 120, 0, 180, 120, 520);
    glow.addColorStop(0, token('--brand', 0.22));
    glow.addColorStop(1, token('--brand', 0));
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    // Dot grid
    ctx.fillStyle = token('--content-subtle', 0.16);
    for (let y = 40; y < H; y += 28) {
      for (let x = 40; x < W; x += 28) {
        ctx.beginPath();
        ctx.arc(x, y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Logo mark
    ctx.fillStyle = brand;
    roundRect(ctx, 72, 64, 56, 56, 14);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = '600 30px "Geist Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⌘', 100, 100);

    ctx.textAlign = 'left';
    ctx.fillStyle = content;
    ctx.font = '600 26px "Bricolage Grotesque", "Geist", sans-serif';
    ctx.fillText('DevPrep', 148, 92);
    ctx.fillStyle = muted;
    ctx.font = '400 15px "Geist", sans-serif';
    ctx.fillText('Full Stack interview prep', 148, 116);

    // Headline
    ctx.fillStyle = content;
    ctx.font = '600 62px "Bricolage Grotesque", "Geist", sans-serif';
    ctx.fillText(`${stats.name} is ${stats.overall}% ready`, 72, 236);

    ctx.fillStyle = muted;
    ctx.font = '400 24px "Geist", sans-serif';
    ctx.fillText(
      stats.streak > 0
        ? `${stats.streak}-day streak · longest ${stats.longestStreak}`
        : 'Just getting started',
      72,
      282,
    );

    // Stat tiles
    const tiles = [
      { label: 'PROBLEMS SOLVED', value: `${stats.solved}/${stats.totalProblems}` },
      { label: 'TOPICS KNOWN', value: String(stats.topicsKnown) },
      { label: 'ACCURACY', value: `${stats.accuracy}%` },
      { label: 'STREAK', value: `${stats.streak}` },
    ];

    const tileW = 252;
    const gap = 20;
    tiles.forEach((tile, i) => {
      const x = 72 + i * (tileW + gap);
      const y = 340;
      ctx.fillStyle = raised;
      roundRect(ctx, x, y, tileW, 150, 18);
      ctx.fill();
      ctx.strokeStyle = line;
      ctx.lineWidth = 1.5;
      roundRect(ctx, x, y, tileW, 150, 18);
      ctx.stroke();

      ctx.fillStyle = muted;
      ctx.font = '500 13px "Geist", sans-serif';
      ctx.fillText(tile.label, x + 24, y + 40);

      ctx.fillStyle = content;
      ctx.font = '600 46px "Geist Mono", monospace';
      ctx.fillText(tile.value, x + 24, y + 100);
    });

    // Progress bar
    const barY = 540;
    ctx.fillStyle = token('--surface-sunken');
    roundRect(ctx, 72, barY, W - 144, 12, 6);
    ctx.fill();
    ctx.fillStyle = brand;
    roundRect(ctx, 72, barY, ((W - 144) * stats.overall) / 100, 12, 6);
    ctx.fill();

    ctx.fillStyle = muted;
    ctx.font = '400 15px "Geist", sans-serif';
    ctx.fillText('Built and studied with DevPrep IDE', 72, 590);
  }, [stats]);

  useEffect(() => {
    if (!open) return;
    // Wait for webfonts, or the card renders in a fallback face.
    void document.fonts.ready.then(draw);
  }, [open, draw]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `devprep-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const copy = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!blob) return;
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard image write is not supported everywhere; download still is.
      download();
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      onMouseDown={onClose}
      role="presentation"
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className="card animate-scale-in w-full max-w-2xl overflow-hidden shadow-2xl"
        role="dialog"
        aria-label="Share your progress"
      >
        <div className="flex items-center gap-3 border-b border-line px-5 py-3">
          <h2 className="font-display text-[15px] font-semibold text-content">Share your progress</h2>
          <button
            onClick={onClose}
            className="ml-auto rounded-lg p-1.5 text-content-subtle transition-colors hover:text-content"
            aria-label="Close"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="bg-surface-sunken p-4">
          <canvas
            ref={canvasRef}
            className="w-full rounded-lg border border-line"
            style={{ aspectRatio: '1200 / 630' }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-line px-5 py-3">
          <p className="text-[12px] text-content-subtle">
            Theme ke hisaab se card banta hai — light/dark switch karke dobara dekho
          </p>
          <div className="ml-auto flex gap-2">
            <Button size="sm" onClick={() => void copy()} className={cx(copied && 'text-easy')}>
              {copied ? 'Copied' : 'Copy image'}
            </Button>
            <Button size="sm" variant="primary" onClick={download}>
              Download PNG
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Canvas has no rounded-rect primitive in older engines; this is the polyfill. */
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
