/**
 * A small ear-training quiz for the Guitar course: play a synthesized note
 * from the lesson's own note pool, then identify it from multiple choice.
 *
 * Two modes, because they train two different things:
 * - "Note Name" — the abstract pitch (music-theory recognition).
 * - "String & Fret" — the actual physical spot that made the sound. This is
 *   the one that matters most for playing: the goal is for a heard note to
 *   send the hand straight to the right string and fret, not through a
 *   detour via a note-name label first.
 *
 * Deliberately scoped as a recognition drill, not a full pro ear-trainer —
 * the same "honest scope" this course applied to every other skill (see
 * Module 26's closing lesson).
 */

import { useState } from 'react';
import { audioSupported, midiToNoteName, noteMidi, playNote } from '../utils/guitarAudio';
import './guitar-hearing-test.css';

const ALL_NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const STRING_NAMES = ['E', 'A', 'D', 'G', 'B', 'e'];

type Mode = 'position' | 'note';
type Pos = { string: number; fret: number };
interface Choice {
  key: string;
  label: string;
}

function shuffled<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

function posKey(p: Pos): string {
  return `${p.string}:${p.fret}`;
}

function posLabel(p: Pos): string {
  return `${STRING_NAMES[p.string] ?? '?'} · fret ${p.fret}`;
}

function pickRound(pool: Pos[], mode: Mode): { midi: number; choices: Choice[]; correctKey: string } {
  const note = pool[Math.floor(Math.random() * pool.length)]!;
  const midi = noteMidi(note.string, note.fret);

  if (mode === 'note') {
    const correct = midiToNoteName(midi);
    const distractors = shuffled(ALL_NOTE_NAMES.filter((n) => n !== correct)).slice(0, 3);
    const choices = shuffled([correct, ...distractors]).map((n) => ({ key: n, label: n }));
    return { midi, choices, correctKey: correct };
  }

  const correctKey = posKey(note);
  const others = pool.filter((p) => posKey(p) !== correctKey);
  const distractors = shuffled(others).slice(0, 3);
  const choices = shuffled([note, ...distractors]).map((p) => ({ key: posKey(p), label: posLabel(p) }));
  return { midi, choices, correctKey };
}

export function GuitarHearingTest({
  notePool,
  lang,
}: {
  notePool: { string: number; fret: number }[];
  lang: 'en' | 'hi';
}) {
  const [mode, setMode] = useState<Mode>('position');
  const [round, setRound] = useState(() => pickRound(notePool, 'position'));
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const supported = audioSupported();

  const handlePlay = () => {
    if (supported) playNote(round.midi, 0.8);
  };

  const handleModeChange = (next: Mode) => {
    setMode(next);
    setRound(pickRound(notePool, next));
    setSelected(null);
  };

  const handleChoose = (key: string) => {
    if (selected) return;
    setSelected(key);
    setScore((s) => ({ correct: s.correct + (key === round.correctKey ? 1 : 0), total: s.total + 1 }));
  };

  const handleNext = () => {
    setRound(pickRound(notePool, mode));
    setSelected(null);
  };

  if (!supported) {
    return (
      <p className="ght-noaudio">
        {lang === 'hi'
          ? 'Is browser mein audio playback support nahi hai, isliye hearing test yahan available nahi hai.'
          : "This browser doesn't support audio playback, so the hearing test isn't available here."}
      </p>
    );
  }

  const correctLabel = round.choices.find((c) => c.key === round.correctKey)?.label ?? round.correctKey;

  return (
    <div className="ght">
      <div className="ght-top">
        <div className="ght-modes" role="group" aria-label="Quiz mode">
          <button
            type="button"
            className={`ght-mode ${mode === 'position' ? 'active' : ''}`}
            onClick={() => handleModeChange('position')}
          >
            {lang === 'hi' ? 'String & Fret' : 'String & Fret'}
          </button>
          <button
            type="button"
            className={`ght-mode ${mode === 'note' ? 'active' : ''}`}
            onClick={() => handleModeChange('note')}
          >
            {lang === 'hi' ? 'Note Naam' : 'Note Name'}
          </button>
        </div>
        <div className="ght-score">Score: {score.correct} / {score.total}</div>
      </div>

      <p className="ght-mode-hint">
        {mode === 'position'
          ? lang === 'hi'
            ? 'Goal: sunte hi haath seedha sahi string/fret par jaana chahiye — note ka naam yaad karne ki zaroorat nahi.'
            : "Goal: on hearing it, your hand should go straight to the right string and fret — no detour through the note's name."
          : lang === 'hi'
            ? 'Ye pitch (note naam) pehchaanne ki practice hai — music-theory recognition.'
            : "This is pitch (note-name) recognition practice — the music-theory side."}
      </p>

      <button type="button" className="ght-play" onClick={handlePlay}>
        🔊 {lang === 'hi' ? 'Note Bajao' : 'Play the Note'}
      </button>

      <div className="ght-choices">
        {round.choices.map((choice) => {
          const isCorrect = choice.key === round.correctKey;
          const isPicked = choice.key === selected;
          const cls = !selected
            ? 'ght-choice'
            : isCorrect
              ? 'ght-choice correct'
              : isPicked
                ? 'ght-choice wrong'
                : 'ght-choice';
          return (
            <button key={choice.key} type="button" className={cls} onClick={() => handleChoose(choice.key)}>
              {choice.label}
            </button>
          );
        })}
      </div>

      {selected && (
        <div className={`ght-feedback ${selected === round.correctKey ? 'correct' : 'wrong'}`}>
          {selected === round.correctKey
            ? lang === 'hi'
              ? 'Sahi! 🎉'
              : 'Correct! 🎉'
            : lang === 'hi'
              ? `Galat — sahi jawaab ${correctLabel} tha.`
              : `Not quite — it was ${correctLabel}.`}
          <button type="button" className="ght-next" onClick={handleNext}>
            {lang === 'hi' ? 'Agla' : 'Next'} →
          </button>
        </div>
      )}
    </div>
  );
}
