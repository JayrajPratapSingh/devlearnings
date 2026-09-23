/**
 * Reusable SVG diagram generators for the Guitar course. Every visual in
 * every `course-guitar-moduleN.ts` file is built through these functions —
 * never hand-typed inline — so every chord/fretboard diagram in the whole
 * course stays pixel-consistent and only needs fixing in one place.
 *
 * Rendered inside a sandboxed `<iframe srcDoc>` (see `LessonExample.preview`
 * in `course-js-module1.ts`) with no JS allowed, so everything here produces
 * plain static SVG/HTML strings, computed once at seed time.
 */

export type FretValue = 'x' | number;

export interface ChordSpec {
  name: string;
  /** [string6/lowE, string5/A, string4/D, string3/G, string2/B, string1/highE] */
  frets: [FretValue, FretValue, FretValue, FretValue, FretValue, FretValue];
  /** Parallel to `frets`: 1=index 2=middle 3=ring 4=pinky, null for open/muted. */
  fingers: [number | null, number | null, number | null, number | null, number | null, number | null];
  /** Which real fret the top of the diagram represents (>1 for chords up the neck). */
  startFret?: number;
  barre?: { fret: number; fromString: number; toString: number };
}

const W = 240;
const TOPPAD = 46;
const GRID_W = 170;
const GRID_H = 180;
const LEFT = (W - GRID_W) / 2;
const NUM_FRETS = 4;
const STRING_GAP = GRID_W / 5;
const FRET_GAP = GRID_H / NUM_FRETS;
const BOTTOMPAD = 56;
const H = TOPPAD + GRID_H + BOTTOMPAD;

const DARK_BG = '#0f172a';
const STRING_COLOR = '#475569';
const FRET_COLOR = '#334155';
const NUT_COLOR = '#e2e8f0';
const DOT_FILL = '#f59e0b';
const DOT_TEXT = '#0f172a';
const OPEN_COLOR = '#22c55e';
const MUTE_COLOR = '#ef4444';
const LABEL_COLOR = '#e2e8f0';
const BARRE_FILL = '#f59e0b';

function stringX(i: number): number {
  return LEFT + i * STRING_GAP;
}
function fretY(n: number): number {
  return TOPPAD + n * FRET_GAP;
}

/** One chord diagram: fretboard grid, O/X markers, numbered finger dots, optional barre. */
export function chordSvg(spec: ChordSpec): string {
  const { name, frets, fingers, startFret = 1, barre = null } = spec;
  const parts: string[] = [];
  parts.push(
    `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;">`,
  );
  parts.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="${DARK_BG}"/>`);

  if (startFret > 1) {
    parts.push(
      `<text x="${LEFT - 14}" y="${fretY(0) + 14}" fill="${LABEL_COLOR}" font-size="13" font-weight="700" text-anchor="end" font-family="system-ui,sans-serif">${startFret}fr</text>`,
    );
  }

  for (let i = 0; i < 6; i++) {
    const x = stringX(i);
    parts.push(
      `<line x1="${x}" y1="${fretY(0)}" x2="${x}" y2="${fretY(NUM_FRETS)}" stroke="${STRING_COLOR}" stroke-width="2"/>`,
    );
  }

  for (let f = 0; f <= NUM_FRETS; f++) {
    const y = fretY(f);
    const isNut = f === 0 && startFret === 1;
    parts.push(
      `<line x1="${stringX(0)}" y1="${y}" x2="${stringX(5)}" y2="${y}" stroke="${isNut ? NUT_COLOR : FRET_COLOR}" stroke-width="${isNut ? 5 : 1.5}"/>`,
    );
  }

  for (let i = 0; i < 6; i++) {
    const x = stringX(i);
    const y = fretY(0) - 20;
    const val = frets[i]!;
    if (val === 'x') {
      parts.push(
        `<text x="${x}" y="${y + 8}" fill="${MUTE_COLOR}" font-size="15" font-weight="700" text-anchor="middle" font-family="system-ui,sans-serif">&#10005;</text>`,
      );
    } else if (val === 0) {
      parts.push(`<circle cx="${x}" cy="${y}" r="7" fill="none" stroke="${OPEN_COLOR}" stroke-width="2.5"/>`);
    }
  }

  if (barre) {
    const y = fretY(barre.fret - 1) + FRET_GAP / 2;
    const x1 = stringX(barre.fromString);
    const x2 = stringX(barre.toString);
    parts.push(
      `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${BARRE_FILL}" stroke-width="20" stroke-linecap="round" opacity="0.9"/>`,
    );
  }

  for (let i = 0; i < 6; i++) {
    const val = frets[i]!;
    if (val === 'x' || val === 0) continue;
    const x = stringX(i);
    const y = fretY(val - 1) + FRET_GAP / 2;
    parts.push(`<circle cx="${x}" cy="${y}" r="12" fill="${DOT_FILL}"/>`);
    const fingerNum = fingers[i];
    if (fingerNum) {
      parts.push(
        `<text x="${x}" y="${y + 5}" fill="${DOT_TEXT}" font-size="13" font-weight="800" text-anchor="middle" font-family="system-ui,sans-serif">${fingerNum}</text>`,
      );
    }
  }

  const stringNames = ['E', 'A', 'D', 'G', 'B', 'e'];
  for (let i = 0; i < 6; i++) {
    parts.push(
      `<text x="${stringX(i)}" y="${fretY(NUM_FRETS) + 16}" fill="#64748b" font-size="10" text-anchor="middle" font-family="monospace">${stringNames[i]}</text>`,
    );
  }

  parts.push(
    `<text x="${W / 2}" y="${H - 8}" fill="${LABEL_COLOR}" font-size="16" font-weight="800" text-anchor="middle" font-family="system-ui,sans-serif">${name}</text>`,
  );

  parts.push('</svg>');
  return parts.join('');
}

function darkWrap(inner: string, caption?: string): string {
  return (
    '<div style="padding:12px;font-family:system-ui,-apple-system,sans-serif;background:#0f172a;color:#e2e8f0;box-sizing:border-box;min-height:100%;">' +
    (caption ? `<p style="font-size:11px;color:#94a3b8;margin:0 0 8px;line-height:1.4;">${caption}</p>` : '') +
    inner +
    '</div>'
  );
}

/** One chord diagram + caption, ready for `LessonExample.preview`. */
export function chordPreviewHtml(spec: ChordSpec, caption?: string): string {
  return darkWrap(chordSvg(spec), caption);
}

/** Several chord diagrams side by side (wraps responsively on narrow widths). */
export function chordFamilyHtml(specs: ChordSpec[], caption?: string): string {
  const cells = specs.map((s) => `<div style="flex:1;min-width:150px;">${chordSvg(s)}</div>`).join('');
  return darkWrap(`<div style="display:flex;flex-wrap:wrap;gap:8px;">${cells}</div>`, caption);
}

const DIAG_MUTED = '#94a3b8';
const DIAG_ACCENT = '#f59e0b';
const DIAG_WOOD = '#a16207';
const DIAG_WOOD_LIGHT = '#ca8a04';
const DIAG_STRING = '#cbd5e1';

/** Labeled schematic of a full guitar, part names via leader lines. */
export function guitarAnatomySvg(): string {
  const w = 640;
  const h = 340;
  const parts: string[] = [];
  parts.push(
    `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;">`,
  );
  parts.push(`<rect x="0" y="0" width="${w}" height="${h}" fill="${DARK_BG}"/>`);

  parts.push(`<rect x="20" y="120" width="60" height="60" rx="8" fill="${DIAG_WOOD}" stroke="${DIAG_WOOD_LIGHT}" stroke-width="2"/>`);
  for (let i = 0; i < 3; i++) {
    parts.push(`<circle cx="30" cy="${132 + i * 18}" r="4" fill="#e2e8f0"/>`);
    parts.push(`<circle cx="70" cy="${132 + i * 18}" r="4" fill="#e2e8f0"/>`);
  }
  parts.push(`<rect x="80" y="145" width="6" height="30" fill="#e2e8f0"/>`);
  parts.push(`<rect x="86" y="150" width="230" height="20" fill="${DIAG_WOOD}"/>`);
  for (let i = 0; i < 8; i++) {
    const x = 100 + i * 27;
    parts.push(`<line x1="${x}" y1="150" x2="${x}" y2="170" stroke="#cbd5e1" stroke-width="1.5" opacity="0.7"/>`);
  }
  for (const fret of [3, 5, 7]) {
    const x = 100 + (fret - 0.5) * 27;
    parts.push(`<circle cx="${x}" cy="160" r="3" fill="#fde68a"/>`);
  }
  for (let i = 0; i < 6; i++) {
    const y = 153 + i * 3;
    parts.push(`<line x1="86" y1="${y}" x2="560" y2="${y}" stroke="${DIAG_STRING}" stroke-width="1"/>`);
  }
  parts.push(`<ellipse cx="420" cy="180" rx="110" ry="95" fill="${DIAG_WOOD}" stroke="${DIAG_WOOD_LIGHT}" stroke-width="3"/>`);
  parts.push(`<ellipse cx="340" cy="150" rx="70" ry="62" fill="${DIAG_WOOD}" stroke="${DIAG_WOOD_LIGHT}" stroke-width="3"/>`);
  parts.push(`<circle cx="380" cy="160" r="36" fill="#1c1917" stroke="#78716c" stroke-width="3"/>`);
  parts.push(`<rect x="470" y="150" width="14" height="22" rx="3" fill="#1c1917"/>`);

  const labels: { x1: number; y1: number; x2: number; y2: number; text: string }[] = [
    { x1: 50, y1: 120, x2: 50, y2: 60, text: 'Headstock' },
    { x1: 50, y1: 140, x2: 130, y2: 40, text: 'Tuning pegs' },
    { x1: 83, y1: 150, x2: 83, y2: 90, text: 'Nut' },
    { x1: 200, y1: 150, x2: 200, y2: 60, text: 'Neck / fretboard' },
    { x1: 113, y1: 160, x2: 113, y2: 250, text: 'Frets' },
    { x1: 380, y1: 160, x2: 460, y2: 260, text: 'Soundhole' },
    { x1: 477, y1: 165, x2: 560, y2: 230, text: 'Bridge (strings anchor here)' },
    { x1: 420, y1: 90, x2: 420, y2: 40, text: 'Body' },
  ];
  let topI = 0;
  let botI = 0;
  for (const l of labels) {
    parts.push(
      `<line x1="${l.x1}" y1="${l.y1}" x2="${l.x2}" y2="${l.y2}" stroke="${DIAG_MUTED}" stroke-width="1" stroke-dasharray="3,3"/>`,
    );
    parts.push(`<circle cx="${l.x1}" cy="${l.y1}" r="3" fill="${DIAG_ACCENT}"/>`);
    const isTop = l.y2 < 160;
    const ty = isTop ? 30 + topI++ * 16 : 250 + botI++ * 16;
    parts.push(
      `<text x="${l.x2}" y="${ty}" fill="${LABEL_COLOR}" font-size="12" font-weight="600" text-anchor="middle" font-family="system-ui,sans-serif">${l.text}</text>`,
    );
  }

  parts.push(
    `<text x="${w - 10}" y="140" fill="${DIAG_MUTED}" font-size="11" text-anchor="end" font-family="monospace">string 6 (low E, thickest)</text>`,
  );
  parts.push(
    `<text x="${w - 10}" y="175" fill="${DIAG_MUTED}" font-size="11" text-anchor="end" font-family="monospace">string 1 (high e, thinnest)</text>`,
  );

  parts.push('</svg>');
  return parts.join('');
}

/** Simplified hand icon: 4 numbered fingers (1=index..4=pinky) + thumb behind the neck. */
export function fingerNumberingSvg(): string {
  const w = 420;
  const h = 260;
  const parts: string[] = [];
  parts.push(
    `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;">`,
  );
  parts.push(`<rect x="0" y="0" width="${w}" height="${h}" fill="${DARK_BG}"/>`);
  parts.push(`<rect x="140" y="120" width="140" height="90" rx="20" fill="#78716c" opacity="0.35"/>`);

  const fingers = [
    { name: 'Index', num: 1, x: 150, len: 70 },
    { name: 'Middle', num: 2, x: 190, len: 85 },
    { name: 'Ring', num: 3, x: 230, len: 78 },
    { name: 'Pinky', num: 4, x: 268, len: 55 },
  ];
  for (const f of fingers) {
    const topY = 120 - f.len;
    parts.push(`<rect x="${f.x}" y="${topY}" width="26" height="${f.len + 10}" rx="13" fill="#a8a29e"/>`);
    parts.push(`<circle cx="${f.x + 13}" cy="${topY + 16}" r="14" fill="${DIAG_ACCENT}"/>`);
    parts.push(
      `<text x="${f.x + 13}" y="${topY + 21}" fill="#0f172a" font-size="14" font-weight="800" text-anchor="middle" font-family="system-ui,sans-serif">${f.num}</text>`,
    );
    parts.push(
      `<text x="${f.x + 13}" y="${topY - 8}" fill="${DIAG_MUTED}" font-size="10.5" text-anchor="middle" font-family="system-ui,sans-serif">${f.name}</text>`,
    );
  }
  parts.push(`<rect x="95" y="150" width="24" height="60" rx="12" fill="#a8a29e" transform="rotate(-35 107 180)"/>`);
  parts.push(`<text x="70" y="185" fill="${DIAG_MUTED}" font-size="10.5" text-anchor="middle" font-family="system-ui,sans-serif">Thumb</text>`);
  parts.push(`<text x="70" y="198" fill="${DIAG_MUTED}" font-size="9.5" text-anchor="middle" font-family="system-ui,sans-serif">(behind neck,</text>`);
  parts.push(`<text x="70" y="209" fill="${DIAG_MUTED}" font-size="9.5" text-anchor="middle" font-family="system-ui,sans-serif">never over top)</text>`);
  parts.push(
    `<text x="${w / 2}" y="240" fill="${LABEL_COLOR}" font-size="13" font-weight="700" text-anchor="middle" font-family="system-ui,sans-serif">Standard fretting-hand finger numbers — this is what chord-diagram dots mean</text>`,
  );

  parts.push('</svg>');
  return parts.join('');
}

export interface TabNote {
  /** 0 = high e (top line, as real tab convention prints it) .. 5 = low E (bottom line). */
  string: number;
  /** Time slot, left to right. */
  step: number;
  fret: number;
}

/** Annotated "how to read tab" diagram: 6 lines (high e on top, matching real tab), fret numbers placed in time. */
export function tabExplainerSvg(notes: TabNote[], steps: number): string {
  const w = 520;
  const h = 270;
  const leftPad = 40;
  const rightPad = 20;
  const topPad = 30;
  const lineGap = 26;
  const stepGap = (w - leftPad - rightPad) / Math.max(steps, 1);
  const stringLabels = ['e', 'B', 'G', 'D', 'A', 'E'];

  const parts: string[] = [];
  parts.push(
    `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;">`,
  );
  parts.push(`<rect x="0" y="0" width="${w}" height="${h}" fill="${DARK_BG}"/>`);

  for (let i = 0; i < 6; i++) {
    const y = topPad + i * lineGap;
    parts.push(
      `<text x="${leftPad - 16}" y="${y + 4}" fill="${DIAG_MUTED}" font-size="12" text-anchor="middle" font-family="monospace">${stringLabels[i]}</text>`,
    );
    parts.push(`<line x1="${leftPad}" y1="${y}" x2="${w - rightPad}" y2="${y}" stroke="${STRING_COLOR}" stroke-width="1.5"/>`);
  }

  for (const n of notes) {
    const x = leftPad + (n.step + 0.5) * stepGap;
    const y = topPad + n.string * lineGap;
    parts.push(`<rect x="${x - 9}" y="${y - 9}" width="18" height="18" fill="${DARK_BG}"/>`);
    parts.push(
      `<text x="${x}" y="${y + 5}" fill="${DIAG_ACCENT}" font-size="14" font-weight="800" text-anchor="middle" font-family="monospace">${n.fret}</text>`,
    );
  }

  const arrowY = topPad + 5 * lineGap + 30;
  parts.push(
    `<line x1="${leftPad}" y1="${arrowY}" x2="${w - rightPad - 20}" y2="${arrowY}" stroke="${DIAG_MUTED}" stroke-width="1.5"/>`,
  );
  parts.push(
    `<path d="M ${w - rightPad - 26} ${arrowY - 5} L ${w - rightPad - 20} ${arrowY} L ${w - rightPad - 26} ${arrowY + 5}" fill="none" stroke="${DIAG_MUTED}" stroke-width="1.5"/>`,
  );
  parts.push(
    `<text x="${(leftPad + w - rightPad) / 2}" y="${arrowY + 18}" fill="${DIAG_MUTED}" font-size="11" text-anchor="middle" font-family="system-ui,sans-serif">time — read left to right, in order</text>`,
  );

  parts.push(
    `<text x="${w / 2}" y="${h - 22}" fill="${LABEL_COLOR}" font-size="12" font-weight="600" text-anchor="middle" font-family="system-ui,sans-serif">A number = which fret to press on that line's string.</text>`,
  );
  parts.push(
    `<text x="${w / 2}" y="${h - 6}" fill="${LABEL_COLOR}" font-size="12" font-weight="600" text-anchor="middle" font-family="system-ui,sans-serif">No number on a line at that moment = don't play it.</text>`,
  );

  parts.push('</svg>');
  return parts.join('');
}

/** Wrap any raw SVG/HTML fragment in the same dark card + optional caption as the chord helpers. */
export function diagramPreviewHtml(svg: string, caption?: string): string {
  return darkWrap(svg, caption);
}

export type StrumSymbol = 'D' | 'U' | 'X' | '-';

export interface StrumBeat {
  /** D = down strum, U = up strum, X = percussive chuck/mute hit, '-' = skip (no motion). */
  symbol: StrumSymbol;
  /** Beat label shown above, e.g. "1", "&", "2". */
  label: string;
  /** Slightly dims this beat's arrow — used for a "ghost strum" that doesn't hit strings. */
  ghost?: boolean;
}

const STRUM_COLORS: Record<StrumSymbol, string> = {
  D: '#22c55e',
  U: '#3b82f6',
  X: '#ef4444',
  '-': '#475569',
};

/** A strum-pattern timeline: down/up/chuck arrows aligned under beat labels, left to right in time. */
export function strumPatternSvg(beats: StrumBeat[]): string {
  const cellW = 66;
  const w = Math.max(beats.length * cellW + 40, 200);
  const h = 185;
  const midY = 90;
  const parts: string[] = [];
  parts.push(
    `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;">`,
  );
  parts.push(`<rect x="0" y="0" width="${w}" height="${h}" fill="${DARK_BG}"/>`);
  parts.push(
    `<defs>
      <marker id="strum-down" markerWidth="10" markerHeight="10" refX="5" refY="8" orient="auto"><path d="M1,1 L9,1 L5,9 Z" fill="${STRUM_COLORS.D}"/></marker>
      <marker id="strum-up" markerWidth="10" markerHeight="10" refX="5" refY="1" orient="auto"><path d="M1,9 L9,9 L5,1 Z" fill="${STRUM_COLORS.U}"/></marker>
    </defs>`,
  );

  beats.forEach((beat, i) => {
    const cx = 30 + i * cellW + cellW / 2;
    const color = STRUM_COLORS[beat.symbol];
    const opacity = beat.ghost ? 0.4 : 1;
    parts.push(
      `<text x="${cx}" y="24" fill="${DIAG_MUTED}" font-size="13" font-weight="700" text-anchor="middle" font-family="monospace">${beat.label}</text>`,
    );
    if (beat.symbol === 'D') {
      parts.push(
        `<line x1="${cx}" y1="${midY - 26}" x2="${cx}" y2="${midY + 22}" stroke="${color}" stroke-width="4" marker-end="url(#strum-down)" opacity="${opacity}"/>`,
      );
      parts.push(`<text x="${cx}" y="${midY + 46}" fill="${color}" font-size="11" text-anchor="middle" font-family="system-ui,sans-serif" opacity="${opacity}">down</text>`);
    } else if (beat.symbol === 'U') {
      parts.push(
        `<line x1="${cx}" y1="${midY + 22}" x2="${cx}" y2="${midY - 26}" stroke="${color}" stroke-width="4" marker-end="url(#strum-up)" opacity="${opacity}"/>`,
      );
      parts.push(`<text x="${cx}" y="${midY + 46}" fill="${color}" font-size="11" text-anchor="middle" font-family="system-ui,sans-serif" opacity="${opacity}">up</text>`);
    } else if (beat.symbol === 'X') {
      parts.push(`<circle cx="${cx}" cy="${midY}" r="16" fill="none" stroke="${color}" stroke-width="4"/>`);
      parts.push(`<text x="${cx}" y="${midY + 5}" fill="${color}" font-size="16" font-weight="800" text-anchor="middle" font-family="system-ui,sans-serif">X</text>`);
      parts.push(`<text x="${cx}" y="${midY + 46}" fill="${color}" font-size="11" text-anchor="middle" font-family="system-ui,sans-serif">chuck</text>`);
    } else {
      parts.push(`<line x1="${cx - 10}" y1="${midY}" x2="${cx + 10}" y2="${midY}" stroke="${color}" stroke-width="3" stroke-dasharray="2,3"/>`);
      parts.push(`<text x="${cx}" y="${midY + 46}" fill="${color}" font-size="11" text-anchor="middle" font-family="system-ui,sans-serif">skip</text>`);
    }
  });

  parts.push(
    `<text x="${w / 2}" y="${h - 10}" fill="${LABEL_COLOR}" font-size="12" font-weight="600" text-anchor="middle" font-family="system-ui,sans-serif">Read left to right, one motion per beat — arrows show strum direction.</text>`,
  );

  parts.push('</svg>');
  return parts.join('');
}
