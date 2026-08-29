import { config } from '../config';
import type { ExecLanguage } from '../sandbox/types';

export interface RunnerSpec {
  /** Human label shown in the UI. */
  label: string;
  /** Docker image that provides the runtime. */
  image: string;
  /** Filename the submitted source is written to. */
  filename: string;
  /** Command executed inside the container / on the host. */
  command: string;
  args: (filename: string) => string[];
}

/**
 * "javascript" and "nodejs" both execute on the Node runtime — the distinction
 * is presentational, so the user can frame a solution as browser-flavoured JS
 * or as a Node script. Keeping them as separate keys means either can grow its
 * own image (e.g. a real browser JS engine) without touching call sites.
 */
export const RUNNERS: Record<ExecLanguage, RunnerSpec> = {
  javascript: {
    label: 'JavaScript',
    image: config.NODE_IMAGE,
    filename: 'main.js',
    command: 'node',
    args: (filename) => ['--max-old-space-size=192', filename],
  },
  nodejs: {
    label: 'Node.js',
    image: config.NODE_IMAGE,
    filename: 'main.js',
    command: 'node',
    args: (filename) => ['--max-old-space-size=192', filename],
  },
  python: {
    label: 'Python',
    image: config.PYTHON_IMAGE,
    filename: 'main.py',
    // -I isolates the interpreter: no user site-packages, no PYTHON* env vars.
    // -u keeps stdout unbuffered so output survives a hard kill.
    command: 'python3',
    args: (filename) => ['-I', '-u', filename],
  },
};

export function getRunner(language: ExecLanguage): RunnerSpec {
  return RUNNERS[language];
}
