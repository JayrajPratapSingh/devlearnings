import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type Theme = 'dark' | 'light';
/** 'en' = English, 'hi' = Hinglish (Hindi written in Roman script). */
export type Lang = 'en' | 'hi';

interface Preferences {
  theme: Theme;
  lang: Lang;
  toggleTheme: () => void;
  setLang: (lang: Lang) => void;
  /** Picks the Hinglish variant when available, else falls back to English. */
  t: (en: string, hi?: string | null) => string;
}

const PreferencesContext = createContext<Preferences | null>(null);

function readStored<T extends string>(key: string, fallback: T, valid: readonly T[]): T {
  try {
    const value = localStorage.getItem(key);
    return value && (valid as readonly string[]).includes(value) ? (value as T) : fallback;
  } catch {
    return fallback;
  }
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => readStored('devprep:theme', 'dark', ['dark', 'light']));
  const [lang, setLangState] = useState<Lang>(() => readStored('devprep:lang', 'en', ['en', 'hi']));

  useEffect(() => {
    // Dark is the default, so the root only carries a class in light mode.
    document.documentElement.classList.toggle('light', theme === 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem('devprep:theme', theme);
    } catch {
      /* private mode — preference simply will not persist */
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('devprep:lang', lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);
  const setLang = useCallback((next: Lang) => setLangState(next), []);

  const t = useCallback(
    (en: string, hi?: string | null) => (lang === 'hi' && hi ? hi : en),
    [lang],
  );

  const value = useMemo<Preferences>(
    () => ({ theme, lang, toggleTheme, setLang, t }),
    [theme, lang, toggleTheme, setLang, t],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences(): Preferences {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error('usePreferences must be used inside <PreferencesProvider>');
  return ctx;
}
