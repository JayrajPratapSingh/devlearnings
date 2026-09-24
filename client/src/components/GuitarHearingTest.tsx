/**
 * A small ear-training quiz for the Guitar course: play a synthesized note
 * from the lesson's own note pool, then pick which note it was from a
 * multiple-choice set. Deliberately scoped as a recognition drill, not a
 * full pro ear-trainer — the same "honest scope" this course applied to
 * every other skill (see Module 26's closing lesson).
 */

import { useState } from 'react';
import { audioSupported, midiToNoteName, noteMidi, playNote } from '../utils/guitarAudio';
import './guitar-hearing-test.css';

const ALL_NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function shuffled<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

function pickRound(pool: { string: number; fret: number }[]): { midi: number; choices: string[]; correct: string } {
  const note = pool[Math.floor(Math.random() * pool.length)]!;
  const midi = noteMidi(note.string, note.fret);
  const correct = midiToNoteName(midi);
  const distractors = shuffled(ALL_NOTE_NAMES.filter((n) => n !== correct)).slice(0, 3);
  const choices = shuffled([correct, ...distractors]);
  return { midi, choices, correct };
}

export function GuitarHearingTest({
  notePool,
  lang,
}: {
  notePool: { string: number; fret: number }[];
  lang: 'en' | 'hi';
}) {
  const [round, setRound] = useState(() => pickRound(notePool));
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const supported = audioSupported();

  const handlePlay = () => {
    if (supported) playNote(round.midi, 0.8);
  };

  const handleChoose = (choice: string) => {
    if (selected) return;
    setSelected(choice);
    setScore((s) => ({ correct: s.correct + (choice === round.correct ? 1 : 0), total: s.total + 1 }));
  };

  const handleNext = () => {
    setRound(pickRound(notePool));
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

  return (
    <div className="ght">
      <div className="ght-score">
        {lang === 'hi' ? 'Score' : 'Score'}: {score.correct} / {score.total}
      </div>

      <button type="button" className="ght-play" onClick={handlePlay}>
        🔊 {lang === 'hi' ? 'Note Bajao' : 'Play the Note'}
      </button>

      <div className="ght-choices">
        {round.choices.map((choice) => {
          const isCorrect = choice === round.correct;
          const isPicked = choice === selected;
          const cls = !selected
            ? 'ght-choice'
            : isCorrect
              ? 'ght-choice correct'
              : isPicked
                ? 'ght-choice wrong'
                : 'ght-choice';
          return (
            <button key={choice} type="button" className={cls} onClick={() => handleChoose(choice)}>
              {choice}
            </button>
          );
        })}
      </div>

      {selected && (
        <div className={`ght-feedback ${selected === round.correct ? 'correct' : 'wrong'}`}>
          {selected === round.correct
            ? lang === 'hi'
              ? 'Sahi! 🎉'
              : 'Correct! 🎉'
            : lang === 'hi'
              ? `Galat — sahi note ${round.correct} tha.`
              : `Not quite — it was ${round.correct}.`}
          <button type="button" className="ght-next" onClick={handleNext}>
            {lang === 'hi' ? 'Agla' : 'Next'} →
          </button>
        </div>
      )}
    </div>
  );
}
