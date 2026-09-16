/**
 * Reads a passage aloud, teleprompter-style: the text scrolls itself so the
 * learner can keep their eyes on the words and speak them out loud, instead
 * of hunting for their place after every glance away.
 *
 * Speed is expressed as words-per-minute so the control is easy to reason
 * about (a comfortable spoken pace is roughly 120-150 wpm) rather than an
 * abstract "scroll speed" the learner has to calibrate by trial and error.
 */

import { useEffect, useRef, useState } from 'react';
import './teleprompter.css';

const MIN_WPM = 60;
const MAX_WPM = 220;
const DEFAULT_WPM = 130;
/** Average characters per word, English prose — good enough to turn a wpm
 *  target into a px/second scroll rate without an exact word count. */
const CHARS_PER_WORD = 5.5;
/** A fixed timer tick rather than requestAnimationFrame: rAF is tied to the
 *  compositor and can silently stop firing in some embedded/preview browser
 *  contexts even while the document reports itself focused and visible —
 *  confirmed by direct testing in this project's own preview tooling. A
 *  plain interval has no such dependency and 20 ticks/second is smoother
 *  than reading speed needs anyway. */
const TICK_MS = 50;

export function Teleprompter({
  text,
  label,
  labelReset,
}: {
  text: string;
  label: string;
  labelReset: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTickRef = useRef<number | null>(null);
  const scrollPosRef = useRef(0);

  const [playing, setPlaying] = useState(false);
  const [wpm, setWpm] = useState(DEFAULT_WPM);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);

  // A fresh passage (new lesson) always starts from the top, paused.
  useEffect(() => {
    scrollPosRef.current = 0;
    lastTickRef.current = null;
    setPlaying(false);
    setDone(false);
    setProgress(0);
    if (trackRef.current) trackRef.current.style.transform = 'translateY(0px)';
  }, [text]);

  useEffect(() => {
    if (!playing) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      lastTickRef.current = null;
      return;
    }

    const charsPerSecond = (wpm * CHARS_PER_WORD) / 60;
    // Rough English text density used only to turn a char/s rate into px/s —
    // does not need to be exact, only consistent tick to tick.
    const pxPerSecond = charsPerSecond * 0.9;

    lastTickRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const track = trackRef.current;
      const viewport = viewportRef.current;
      if (!track || !viewport) return;

      const now = Date.now();
      const dtSeconds = (now - (lastTickRef.current ?? now)) / 1000;
      lastTickRef.current = now;
      scrollPosRef.current += pxPerSecond * dtSeconds;

      const maxScroll = Math.max(0, track.scrollHeight - viewport.clientHeight);
      if (scrollPosRef.current >= maxScroll) {
        scrollPosRef.current = maxScroll;
        track.style.transform = `translateY(-${scrollPosRef.current}px)`;
        setProgress(1);
        setPlaying(false);
        setDone(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }

      track.style.transform = `translateY(-${scrollPosRef.current}px)`;
      setProgress(maxScroll === 0 ? 0 : scrollPosRef.current / maxScroll);
    }, TICK_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, wpm]);

  const handleReset = () => {
    scrollPosRef.current = 0;
    lastTickRef.current = null;
    setPlaying(false);
    setDone(false);
    setProgress(0);
    if (trackRef.current) trackRef.current.style.transform = 'translateY(0px)';
  };

  return (
    <div className="teleprompter">
      <div className="teleprompter-viewport" ref={viewportRef}>
        <div className="teleprompter-track" ref={trackRef}>
          <p>{text}</p>
        </div>
        <div className="teleprompter-fade top" />
        <div className="teleprompter-fade bottom" />
      </div>

      <div className="teleprompter-progress">
        <div className="teleprompter-progress-fill" style={{ width: `${progress * 100}%` }} />
      </div>

      <div className="teleprompter-controls">
        <button
          type="button"
          className="teleprompter-play"
          onClick={() => {
            if (done) {
              handleReset();
              setPlaying(true);
            } else {
              setPlaying((p) => !p);
            }
          }}
          aria-label={done ? 'Restart' : playing ? 'Pause' : 'Play'}
        >
          {done ? '↻' : playing ? '❚❚' : '▶'}
        </button>

        <button type="button" className="teleprompter-reset" onClick={handleReset}>
          {labelReset}
        </button>

        <label className="teleprompter-speed">
          <span>{wpm} wpm</span>
          <input
            type="range"
            min={MIN_WPM}
            max={MAX_WPM}
            step={10}
            value={wpm}
            onChange={(e) => setWpm(Number(e.target.value))}
          />
        </label>
      </div>

      <p className="teleprompter-hint">{label}</p>
    </div>
  );
}
