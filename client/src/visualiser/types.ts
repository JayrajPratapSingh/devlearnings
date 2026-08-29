/**
 * The visualiser is deliberately dumb: an algorithm is a generator that yields
 * `Frame`s, and the player just walks them. Nothing about the player knows what
 * Two Sum or Kadane is, so adding an algorithm never means touching the UI.
 *
 * A Frame is a *snapshot*, not a diff — that is what makes scrubbing backwards
 * free. Frames are cheap (tens of them, small objects), so the simplicity is
 * worth far more than the memory.
 */

export type Tone = 'idle' | 'active' | 'good' | 'bad' | 'warn' | 'done' | 'dim';

/** A marker sitting under an array index — `i`, `left`, `right`, `mid`… */
export interface Pointer {
  name: string;
  index: number;
  tone: Tone;
}

/** A highlighted span of the array — a window, a search range, a partition. */
export interface Range {
  from: number;
  to: number;
  tone: Tone;
  label?: string;
}

export interface MapEntry {
  key: string;
  value: string;
  /** Pulses on the frame it was written. */
  fresh?: boolean;
  /** Highlighted because the algorithm just looked it up. */
  hit?: boolean;
}

export interface TableCell {
  value: string | number | null;
  tone?: Tone;
}

export interface Frame {
  /** One short sentence: what just happened and why. Shown under the canvas. */
  note: string;
  /** Hinglish version — the app-wide EN/HI toggle switches between them. */
  noteHi: string;

  /** The main array being worked on. Omit for grid/table-only algorithms. */
  cells?: (string | number)[];
  /** Per-index tone, keyed by index. */
  cellTones?: Record<number, Tone>;
  pointers?: Pointer[];
  ranges?: Range[];

  /** Side panels — rendered only when present. */
  map?: { title: string; entries: MapEntry[] };
  stack?: { title: string; items: string[]; poppedLabel?: string };
  table?: {
    title: string;
    rows: TableCell[][];
    rowLabels?: string[];
    colLabels?: string[];
  };
  grid?: {
    title: string;
    rows: string[][];
    tones: Record<string, Tone>;
  };

  /** Running values shown as chips — `sum = 14`, `best = 6`. */
  vars?: { label: string; value: string; tone?: Tone }[];

  /** Set on the final frame. */
  result?: string;
  resultHi?: string;
}

export interface AlgorithmDemo {
  id: string;
  title: string;
  /** The pattern this teaches — shown as the subtitle. */
  pattern: string;
  /** DSA problem slugs this belongs to, so the problem page can find it. */
  problemSlugs: string[];
  /** Topic slugs this belongs to. */
  topicSlugs?: string[];
  /** The input, rendered above the canvas so the frames make sense. */
  inputLabel: string;
  complexity: { time: string; space: string };
  build: () => Frame[];
}
