/**
 * Shared between the course list and course detail pages so the two never
 * drift — one course, one icon, everywhere it appears.
 */
import type { ReactNode } from 'react';
import {
  SiDjango,
  SiJavascript,
  SiNextdotjs,
  SiNodedotjs,
  SiPython,
  SiReact,
  SiThreedotjs,
  SiTypescript,
} from 'react-icons/si';
import { Brain, Database, Infinity as InfinityIcon, Palette, Puzzle, Smartphone, Sparkles } from 'lucide-react';

/**
 * Real marks, not emoji. Brand logos where the course teaches one specific
 * technology; a purposeful generic icon where it deliberately spans several
 * (Databases covers Postgres/Mongo/Redis/SQLite — no single logo is honest;
 * DevOps is a discipline, not a product).
 */
export const COURSE_ICON: Record<string, ReactNode> = {
  'javascript-complete': <SiJavascript />,
  'css-html-complete': <Palette />,
  'typescript-complete': <SiTypescript />,
  'react-complete': <SiReact />,
  'node-complete': <SiNodedotjs />,
  'dsa-complete': <Puzzle />,
  'python-complete': <SiPython />,
  'django-complete': <SiDjango />,
  'databases-complete': <Database />,
  'devops-complete': <InfinityIcon />,
  'nextjs-complete': <SiNextdotjs />,
  'genai-complete': <Sparkles />,
  'psychology-for-developers': <Brain />,
  'threejs-r3f-complete': <SiThreedotjs />,
  'react-native-complete': <Smartphone />,
};

export function courseIcon(slug: string): ReactNode {
  return COURSE_ICON[slug] ?? <Puzzle />;
}
