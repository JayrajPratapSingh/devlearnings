import Editor, { type OnMount } from '@monaco-editor/react';
import { useRef } from 'react';
import { usePreferences } from '../hooks/usePreferences';
import type { Language } from '../types';
import { Spinner } from '../components/ui';

const MONACO_LANGUAGE: Record<Language, string> = {
  JAVASCRIPT: 'javascript',
  NODEJS: 'javascript',
  PYTHON: 'python',
};

interface CodeEditorProps {
  value: string;
  language: Language;
  onChange: (value: string) => void;
  onRun?: () => void;
  onSubmit?: () => void;
  readOnly?: boolean;
}

export function CodeEditor({ value, language, onChange, onRun, onSubmit, readOnly }: CodeEditorProps) {
  const { theme } = usePreferences();
  // Handlers are read through a ref so the keybindings registered on mount
  // always call the latest closure instead of the one from first render.
  const handlers = useRef({ onRun, onSubmit });
  handlers.current = { onRun, onSubmit };

  const onMount: OnMount = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handlers.current.onRun?.();
    });
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter,
      () => {
        handlers.current.onSubmit?.();
      },
    );

    monaco.editor.defineTheme('devprep-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#0d1117',
        'editorGutter.background': '#0d1117',
        'editor.lineHighlightBackground': '#161b22',
        'editorLineNumber.foreground': '#6a7380',
      },
    });
    monaco.editor.setTheme(theme === 'dark' ? 'devprep-dark' : 'vs');
  };

  return (
    <Editor
      height="100%"
      language={MONACO_LANGUAGE[language]}
      value={value}
      onChange={(next) => onChange(next ?? '')}
      onMount={onMount}
      theme={theme === 'dark' ? 'devprep-dark' : 'vs'}
      loading={
        <div className="flex h-full items-center justify-center text-content-subtle">
          <Spinner />
        </div>
      }
      options={{
        readOnly,
        fontFamily: 'JetBrains Mono, ui-monospace, Consolas, monospace',
        fontSize: 13,
        lineHeight: 21,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        smoothScrolling: true,
        automaticLayout: true,
        tabSize: 2,
        padding: { top: 12, bottom: 12 },
        renderLineHighlight: 'line',
        cursorBlinking: 'smooth',
        bracketPairColorization: { enabled: true },
        scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10 },
        // The grader compares stdout, so suggestions matter less than a calm surface.
        quickSuggestions: { other: true, comments: false, strings: false },
      }}
    />
  );
}
