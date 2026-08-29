import type { Topic, TopicCategory } from '@prisma/client';

/**
 * Web Development Topics - Complete Curriculum
 * Organizes React Native, HTML, CSS, and Animation topics into a cohesive learning path.
 */

export const webDevCategories = [
  {
    slug: 'react-native-fundamentals',
    name: 'React Native Fundamentals',
    description: 'Build native iOS and Android apps with JavaScript and React',
    icon: 'smartphone',
    order: 100,
    group: 'web-dev',
  },
  {
    slug: 'react-native-components',
    name: 'React Native Components & APIs',
    description: 'Master core React Native components and platform APIs',
    icon: 'box',
    order: 101,
    group: 'web-dev',
  },
  {
    slug: 'react-native-navigation',
    name: 'React Native Navigation',
    description: 'Navigate between screens in React Native apps',
    icon: 'map',
    order: 102,
    group: 'web-dev',
  },
  {
    slug: 'react-native-styling',
    name: 'React Native Styling',
    description: 'Style React Native components for iOS and Android',
    icon: 'palette',
    order: 103,
    group: 'web-dev',
  },
  {
    slug: 'react-native-state',
    name: 'React Native State Management',
    description: 'Manage state in React Native with Context, Redux, and more',
    icon: 'layers',
    order: 104,
    group: 'web-dev',
  },
  {
    slug: 'react-native-performance',
    name: 'React Native Performance & Optimization',
    description: 'Optimize performance and build production-ready apps',
    icon: 'zap',
    order: 105,
    group: 'web-dev',
  },

  {
    slug: 'html-fundamentals',
    name: 'HTML Fundamentals',
    description: 'Learn semantic HTML, document structure, and web standards',
    icon: 'code',
    order: 110,
    group: 'web-dev',
  },
  {
    slug: 'html-semantic',
    name: 'Semantic HTML',
    description: 'Use semantic elements for accessible, maintainable markup',
    icon: 'layers',
    order: 111,
    group: 'web-dev',
  },
  {
    slug: 'html-forms',
    name: 'HTML Forms & Validation',
    description: 'Build accessible forms with HTML5 validation',
    icon: 'input',
    order: 112,
    group: 'web-dev',
  },
  {
    slug: 'html-accessibility',
    name: 'Accessibility (a11y)',
    description: 'Make HTML accessible with ARIA, semantic markup, and WCAG',
    icon: 'eye',
    order: 113,
    group: 'web-dev',
  },
  {
    slug: 'html-apis',
    name: 'Web APIs & Meta Tags',
    description: 'Use Web APIs, meta tags, and advanced HTML features',
    icon: 'database',
    order: 114,
    group: 'web-dev',
  },

  {
    slug: 'css-fundamentals',
    name: 'CSS Fundamentals',
    description: 'Master the CSS box model, selectors, and styling basics',
    icon: 'paint-brush',
    order: 120,
    group: 'web-dev',
  },
  {
    slug: 'css-layout',
    name: 'Layout: Flexbox & Grid',
    description: 'Modern layouts with Flexbox (1D) and CSS Grid (2D)',
    icon: 'layout',
    order: 121,
    group: 'web-dev',
  },
  {
    slug: 'css-positioning',
    name: 'Positioning & Stacking',
    description: 'Master positioning, z-index, and stacking contexts',
    icon: 'layers',
    order: 122,
    group: 'web-dev',
  },
  {
    slug: 'css-responsive',
    name: 'Responsive Design',
    description: 'Build responsive layouts with media queries and mobile-first design',
    icon: 'responsive',
    order: 123,
    group: 'web-dev',
  },
  {
    slug: 'css-advanced',
    name: 'Advanced CSS Styling',
    description: 'Advanced selectors, pseudo-elements, custom properties, and more',
    icon: 'star',
    order: 124,
    group: 'web-dev',
  },

  {
    slug: 'anim-transitions',
    name: 'CSS Transitions',
    description: 'Smooth state changes with CSS transitions and timing functions',
    icon: 'play',
    order: 130,
    group: 'web-dev',
  },
  {
    slug: 'anim-keyframes',
    name: 'CSS Keyframes & Animations',
    description: 'Complex animations with keyframes, loops, and sequences',
    icon: 'film',
    order: 131,
    group: 'web-dev',
  },
  {
    slug: 'anim-performance',
    name: 'Animation Performance',
    description: 'Achieve smooth 60fps animations with GPU acceleration and profiling',
    icon: 'zap',
    order: 132,
    group: 'web-dev',
  },
  {
    slug: 'anim-advanced',
    name: 'Advanced Animation Patterns',
    description: 'Award-winning animation patterns: parallax, morphing, SVG, staggering',
    icon: 'sparkles',
    order: 133,
    group: 'web-dev',
  },
  {
    slug: 'anim-javascript',
    name: 'JavaScript Animations',
    description: 'Animate with JavaScript: requestAnimationFrame, GSAP, and more',
    icon: 'code',
    order: 134,
    group: 'web-dev',
  },
] as const;

/**
 * Topic seeding data - all topics will be created from seed files
 * The seed files (react-native.ts, html-topics.ts, css-topics.ts, animations.ts)
 * contain the detailed topic content with bilingual support
 */

export const allWebDevTopics = [
  // React Native topics are imported and extended from react-native.ts
  // HTML topics are imported and extended from html-topics.ts
  // CSS topics are imported and extended from css-topics.ts
  // Animation topics are imported and extended from animations.ts
] as const;

/**
 * Export category mapping for easy reference
 */
export const topicCategoryMap = {
  'react-native-fundamentals': 'React Native Fundamentals',
  'react-native-components': 'React Native Components & APIs',
  'react-native-navigation': 'React Native Navigation',
  'react-native-styling': 'React Native Styling',
  'react-native-state': 'React Native State Management',
  'react-native-performance': 'React Native Performance & Optimization',
  'html-fundamentals': 'HTML Fundamentals',
  'html-semantic': 'Semantic HTML',
  'html-forms': 'HTML Forms & Validation',
  'html-accessibility': 'Accessibility (a11y)',
  'html-apis': 'Web APIs & Meta Tags',
  'css-fundamentals': 'CSS Fundamentals',
  'css-layout': 'Layout: Flexbox & Grid',
  'css-positioning': 'Positioning & Stacking',
  'css-responsive': 'Responsive Design',
  'css-advanced': 'Advanced CSS Styling',
  'anim-transitions': 'CSS Transitions',
  'anim-keyframes': 'CSS Keyframes & Animations',
  'anim-performance': 'Animation Performance',
  'anim-advanced': 'Advanced Animation Patterns',
  'anim-javascript': 'JavaScript Animations',
} as const;
