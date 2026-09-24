/**
 * A scrolling, speed-adjustable practice player for the Guitar course: notes
 * approach a fixed "now" line on one of six string lanes, and — the moment
 * each one crosses it — a synthesized tone plays at the correct pitch
 * (`utils/guitarAudio.ts`) while a readout names the exact string, fret, and
 * note. The tempo is a plain BPM slider so a learner can practice a riff or
 * chord change slower than performance speed and work up from there.
 *
 * Timing uses a fixed interval tick rather than requestAnimationFrame, for
 * the same reason `Teleprompter.tsx` does: rAF has been observed to stop
 * firing in some embedded/preview browser contexts even while the document
 * reports itself focused. A plain interval with a real elapsed-time delta
 * has no such dependency.
 */

import { useEffect, useRef, useState } from 'react';
import { audioSupported, midiToNoteName, noteMidi, playNote } from '../utils/guitarAudio';
import './guitar-practice-player.css';

export interface PracticeNote {
  /** 0 = low E .. 5 = high e. */
  string: number;
  fret: number;
  /** Which beat this note starts on, 0-indexed. */
  beat: number;
  duration?: number;
  finger?: number | null;
}

export interface PracticeSequence {
  title: string;
  titleHi?: string;
  defaultBpm: number;
  notes: PracticeNote[];
}

const STRING_NAMES = ['E', 'A', 'D', 'G', 'B', 'e'];
const PX_PER_BEAT = 90;
const NOW_LINE_PX = 44;
const TICK_MS = 40;
const MIN_BPM = 40;
const MAX_BPM = 200;

export function GuitarPracticePlayer({
  sequences,
  lang,
  hint,
}: {
  sequences: PracticeSequence[];
  lang: 'en' | 'hi';
  hint: string;
}) {
  const [seqIndex, setSeqIndex] = useState(0);
  const sequence = sequences[seqIndex];

  const trackRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTickRef = useRef<number | null>(null);
  const beatRef = useRef(0);
  const lastTriggeredIndexRef = useRef(-1);
  const supportedRef = useRef(audioSupported());

  const [playing, setPlaying] = useState(false);
  const [bpm, setBpm] = useState(sequence?.defaultBpm ?? 90);
  const [loop, setLoop] = useState(true);
  const [progress, setProgress] = useState(0);
  const [activeNote, setActiveNote] = useState<PracticeNote | null>(null);

  const totalBeats = sequence
    ? Math.max(...sequence.notes.map((n) => n.beat + (n.duration ?? 1)), 1)
    : 1;

  // A fresh sequence (or a fresh lesson) always starts from the top, paused.
  useEffect(() => {
    beatRef.current = 0;
    lastTickRef.current = null;
    lastTriggeredIndexRef.current = -1;
    setPlaying(false);
    setProgress(0);
    setActiveNote(null);
    setBpm(sequence?.defaultBpm ?? 90);
    if (trackRef.current) trackRef.current.style.transform = 'translateX(0px)';
  }, [seqIndex, sequence]);

  useEffect(() => {
    if (!playing || !sequence) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      lastTickRef.current = null;
      return;
    }

    lastTickRef.current = Date.now();
    const sortedNotes = [...sequence.notes].sort((a, b) => a.beat - b.beat);

    intervalRef.current = setInterval(() => {
      const track = trackRef.current;
      if (!track) return;

      const now = Date.now();
      const dtSeconds = (now - (lastTickRef.current ?? now)) / 1000;
      lastTickRef.current = now;
      const beatsPerSecond = bpm / 60;
      beatRef.current += dtSeconds * beatsPerSecond;

      if (beatRef.current >= totalBeats) {
        if (loop) {
          beatRef.current = 0;
          lastTriggeredIndexRef.current = -1;
        } else {
          beatRef.current = totalBeats;
          setPlaying(false);
        }
      }

      for (let i = 0; i < sortedNotes.length; i++) {
        const note = sortedNotes[i]!;
        if (i > lastTriggeredIndexRef.current && note.beat <= beatRef.current) {
          lastTriggeredIndexRef.current = i;
          setActiveNote(note);
          if (supportedRef.current) playNote(noteMidi(note.string, note.fret), 0.5);
        }
      }

      const scrollPx = beatRef.current * PX_PER_BEAT;
      track.style.transform = `translateX(-${scrollPx}px)`;
      setProgress(totalBeats === 0 ? 0 : Math.min(1, beatRef.current / totalBeats));
    }, TICK_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, bpm, sequence, totalBeats, loop]);

  const handleReset = () => {
    beatRef.current = 0;
    lastTickRef.current = null;
    lastTriggeredIndexRef.current = -1;
    setPlaying(false);
    setProgress(0);
    setActiveNote(null);
    if (trackRef.current) trackRef.current.style.transform = 'translateX(0px)';
  };

  if (!sequence) return null;

  const activeNoteName = activeNote ? midiToNoteName(noteMidi(activeNote.string, activeNote.fret)) : null;

  return (
    <div className="gpp">
      {sequences.length > 1 && (
        <div className="gpp-tabs">
          {sequences.map((s, i) => (
            <button
              key={i}
              type="button"
              className={`gpp-tab ${i === seqIndex ? 'active' : ''}`}
              onClick={() => setSeqIndex(i)}
            >
              {lang === 'hi' && s.titleHi ? s.titleHi : s.title}
            </button>
          ))}
        </div>
      )}

      <div className="gpp-viewport">
        <div className="gpp-string-labels">
          {STRING_NAMES.map((name, i) => (
            <div className="gpp-string-label" key={i}>
              {name}
            </div>
          ))}
        </div>
        <div className="gpp-lanes">
          <div className="gpp-track" ref={trackRef}>
            {STRING_NAMES.map((_, si) => (
              <div className="gpp-lane" key={si}>
                {sequence.notes
                  .filter((n) => n.string === si)
                  .map((n, i) => (
                    <div
                      className={`gpp-note ${activeNote === n ? 'active' : ''}`}
                      style={{ left: NOW_LINE_PX + n.beat * PX_PER_BEAT }}
                      key={i}
                    >
                      {n.fret}
                    </div>
                  ))}
              </div>
            ))}
          </div>
          <div className="gpp-nowline" style={{ left: NOW_LINE_PX }} />
        </div>
      </div>

      <div className="gpp-readout">
        {activeNote ? (
          <>
            <strong>{STRING_NAMES[activeNote.string]}</strong> string · fret {activeNote.fret} ·{' '}
            <strong>{activeNoteName}</strong>
            {activeNote.finger ? ` · finger ${activeNote.finger}` : ''}
          </>
        ) : lang === 'hi' ? (
          'Play dabao shuru karne ke liye'
        ) : (
          'Press play to begin'
        )}
      </div>

      <div className="gpp-progress">
        <div className="gpp-progress-fill" style={{ width: `${progress * 100}%` }} />
      </div>

      <div className="gpp-controls">
        <button
          type="button"
          className="gpp-play"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? '❚❚' : '▶'}
        </button>
        <button type="button" className="gpp-reset" onClick={handleReset}>
          {lang === 'hi' ? 'Shuru se' : 'Restart'}
        </button>
        <label className="gpp-loop">
          <input type="checkbox" checked={loop} onChange={(e) => setLoop(e.target.checked)} />
          {lang === 'hi' ? 'Loop' : 'Loop'}
        </label>
        <label className="gpp-speed">
          <span>{bpm} bpm</span>
          <input
            type="range"
            min={MIN_BPM}
            max={MAX_BPM}
            step={5}
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
          />
        </label>
      </div>

      {!supportedRef.current && (
        <p className="gpp-noaudio">
          {lang === 'hi'
            ? 'Is browser mein audio playback support nahi hai — visual timing abhi bhi kaam karti hai.'
            : "This browser doesn't support audio playback here — the visual timing still works."}
        </p>
      )}

      <p className="gpp-hint">{hint}</p>
    </div>
  );
}
