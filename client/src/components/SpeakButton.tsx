/**
 * Plays a piece of text aloud via the browser's built-in speech synthesis
 * (Web Speech API) — no audio files, no backend, no cost. This is the
 * English Speaking course's answer to "show me the pronunciation
 * difference": a mistake like wrong: `"dis" instead of "this"` genuinely
 * demonstrates itself when read aloud, because "dis" is respelled exactly
 * as it's mispronounced and TTS reads it that way, right next to a
 * correctly pronounced "this".
 */

import { useEffect, useState } from 'react';

/** Strips markdown/formatting noise so TTS doesn't read out asterisks,
 *  quote marks, or parenthetical notes as if they were words. */
function cleanForSpeech(text: string): string {
  return text
    .replace(/\*\*/g, '')
    .replace(/[""]/g, '"')
    .replace(/\([^)]*\)/g, '')
    .trim();
}

export function SpeakButton({
  text,
  label,
  rate = 0.9,
}: {
  text: string;
  label?: string;
  rate?: number;
}) {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
  }, []);

  if (!supported) return null;

  const handleClick = () => {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(cleanForSpeech(text));
    utter.lang = 'en-US';
    utter.rate = rate;
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
  };

  return (
    <button
      type="button"
      className={`speak-btn ${speaking ? 'speaking' : ''}`}
      onClick={handleClick}
      aria-label={label ?? `Listen to "${text}"`}
      title={label ?? 'Listen'}
    >
      🔊
    </button>
  );
}
