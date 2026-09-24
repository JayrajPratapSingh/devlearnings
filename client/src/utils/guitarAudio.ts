/**
 * Web Audio synthesis for the Guitar course's practice tools. No audio
 * files: a short, plucked-string-like tone is synthesized at the correct
 * pitch, computed the same way every fret-to-note calculation in this
 * course's lesson content is — equal temperament, standard tuning.
 */

/** MIDI note number of each open string, low E to high e — standard tuning,
 *  same string ordering as ChordSpec in the seed's guitar-diagrams.ts. */
const OPEN_STRING_MIDI = [40, 45, 50, 55, 59, 64];

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export function noteMidi(stringIndex: number, fret: number): number {
  const open = OPEN_STRING_MIDI[stringIndex];
  if (open === undefined) throw new Error(`Invalid string index: ${stringIndex}`);
  return open + fret;
}

export function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function midiToNoteName(midi: number): string {
  return NOTE_NAMES[((midi % 12) + 12) % 12] ?? '?';
}

export function audioSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    !!((window as typeof window & { webkitAudioContext?: typeof AudioContext }).AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)
  );
}

let sharedContext: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (!audioSupported()) return null;
  const Ctor =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!sharedContext) sharedContext = new Ctor();
  if (sharedContext.state === 'suspended') void sharedContext.resume();
  return sharedContext;
}

/**
 * Plays one synthesized note: a fast attack and an exponential decay
 * approximate a plucked string's natural envelope far better than a flat
 * tone, and a quiet upper partial (an octave above, mixed in softly) gives
 * it a little more color than a single bare oscillator.
 */
export function playNote(midi: number, durationSeconds = 0.6, gain = 0.25): void {
  const ctx = getContext();
  if (!ctx) return;
  const freq = midiToFrequency(midi);
  const now = ctx.currentTime;

  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.linearRampToValueAtTime(gain, now + 0.006);
  master.gain.exponentialRampToValueAtTime(0.0001, now + durationSeconds);
  master.connect(ctx.destination);

  const fundamental = ctx.createOscillator();
  fundamental.type = 'triangle';
  fundamental.frequency.setValueAtTime(freq, now);
  fundamental.connect(master);
  fundamental.start(now);
  fundamental.stop(now + durationSeconds + 0.05);

  const partial = ctx.createOscillator();
  partial.type = 'sine';
  partial.frequency.setValueAtTime(freq * 2, now);
  const partialGain = ctx.createGain();
  partialGain.gain.setValueAtTime(gain * 0.15, now);
  partialGain.gain.exponentialRampToValueAtTime(0.0001, now + durationSeconds * 0.6);
  partial.connect(partialGain);
  partialGain.connect(ctx.destination);
  partial.start(now);
  partial.stop(now + durationSeconds * 0.6 + 0.05);
}
