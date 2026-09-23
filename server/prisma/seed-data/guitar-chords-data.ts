/**
 * Shared chord-shape library for the Guitar course. One source of truth so
 * the same G major (say) looks identical everywhere it's referenced across
 * 26 modules, and so a fingering fix only has to happen in one place.
 */
import type { ChordSpec } from './guitar-diagrams';

export const CHORDS = {
  // ── the "campfire six" open chords, taught in Modules 4-5 ──
  Em: { name: 'Em', frets: [0, 2, 2, 0, 0, 0], fingers: [null, 2, 3, null, null, null] },
  Em7: { name: 'Em7', frets: [0, 2, 0, 0, 0, 0], fingers: [null, 2, null, null, null, null] },
  G: { name: 'G', frets: [3, 2, 0, 0, 0, 3], fingers: [3, 2, null, null, null, 4] },
  C: { name: 'C', frets: ['x', 3, 2, 0, 1, 0], fingers: [null, 3, 2, null, 1, null] },
  Am: { name: 'Am', frets: ['x', 0, 2, 2, 1, 0], fingers: [null, null, 2, 3, 1, null] },
  D: { name: 'D', frets: ['x', 'x', 0, 2, 3, 2], fingers: [null, null, null, 1, 3, 2] },

  // ── more open chords used from Module 6 onward ──
  E: { name: 'E', frets: [0, 2, 2, 1, 0, 0], fingers: [null, 2, 3, 1, null, null] },
  A: { name: 'A', frets: ['x', 0, 2, 2, 2, 0], fingers: [null, null, 1, 2, 3, null] },
  Dm: { name: 'Dm', frets: ['x', 'x', 0, 2, 3, 1], fingers: [null, null, null, 2, 3, 1] },
  A7: { name: 'A7', frets: ['x', 0, 2, 0, 2, 0], fingers: [null, null, 2, null, 3, null] },
  D7: { name: 'D7', frets: ['x', 'x', 0, 2, 1, 2], fingers: [null, null, null, 2, 1, 3] },
  E7: { name: 'E7', frets: [0, 2, 0, 1, 0, 0], fingers: [null, 2, null, 1, null, null] },
  G7: { name: 'G7', frets: [3, 2, 0, 0, 0, 1], fingers: [3, 2, null, null, null, 1] },
  Cadd9: { name: 'Cadd9', frets: ['x', 3, 2, 0, 3, 0], fingers: [null, 2, 1, null, 3, null] },
  Dsus2: { name: 'Dsus2', frets: ['x', 'x', 0, 2, 3, 0], fingers: [null, null, null, 1, 2, null] },
  Dsus4: { name: 'Dsus4', frets: ['x', 'x', 0, 2, 3, 3], fingers: [null, null, null, 1, 2, 3] },

  // ── barre-chord shapes, Module 17 ──
  F: {
    name: 'F',
    frets: [1, 3, 3, 2, 1, 1],
    fingers: [1, 3, 4, 2, 1, 1],
    barre: { fret: 1, fromString: 0, toString: 5 },
  },
  Fm: {
    name: 'Fm',
    frets: [1, 3, 3, 1, 1, 1],
    fingers: [1, 3, 4, 1, 1, 1],
    barre: { fret: 1, fromString: 0, toString: 5 },
  },
  B: {
    name: 'B (A-shape barre, 2nd fret)',
    frets: ['x', 2, 4, 4, 4, 2],
    fingers: [null, 1, 2, 3, 4, 1],
    startFret: 2,
    barre: { fret: 1, fromString: 1, toString: 5 },
  },
  Bm: {
    name: 'Bm (A-shape barre, 2nd fret)',
    frets: ['x', 2, 4, 4, 3, 2],
    fingers: [null, 1, 3, 4, 2, 1],
    startFret: 2,
    barre: { fret: 1, fromString: 1, toString: 5 },
  },
  CSharpMinor: {
    name: 'C#m (Am-shape barre, 4th fret)',
    frets: ['x', 4, 6, 6, 5, 4],
    fingers: [null, 1, 3, 4, 2, 1],
    startFret: 4,
    barre: { fret: 1, fromString: 1, toString: 5 },
  },
} satisfies Record<string, ChordSpec>;

/** Power chords: root + fifth (+ octave), the 2-3 note movable shape from Module 16. Root fret is on the low-E or A string. */
export const POWER_CHORDS = {
  E5: { name: 'E5', frets: [0, 2, 2, 'x', 'x', 'x'], fingers: [null, 1, 3, null, null, null] },
  A5: { name: 'A5', frets: ['x', 0, 2, 2, 'x', 'x'], fingers: [null, null, 1, 3, null, null] },
  G5: {
    name: 'G5 (movable, root on low E)',
    frets: [3, 5, 5, 'x', 'x', 'x'],
    fingers: [1, 3, 4, null, null, null],
    startFret: 3,
  },
  C5: {
    name: 'C5 (movable, root on A string)',
    frets: ['x', 3, 5, 5, 'x', 'x'],
    fingers: [null, 1, 3, 4, null, null],
    startFret: 3,
  },
} satisfies Record<string, ChordSpec>;
