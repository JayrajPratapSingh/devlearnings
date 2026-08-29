import type { SeedProblem } from './shared';

/**
 * CSS — Styling, layout, and responsive design.
 * Covers fundamentals through advanced patterns.
 */

export const CSS_CATEGORIES = [
  'CSS Fundamentals',
  'Layout (Flexbox & Grid)',
  'Positioning & Stacking',
  'Responsive Design',
  'Advanced Styling',
] as const;

export const cssTopics = [
  {
    slug: 'css-box-model',
    title: 'The Box Model',
    category: 'CSS Fundamentals',
    difficulty: 'EASY',
    summary: 'Understand the CSS box model: margin, border, padding, and content. The foundation of all layout.',
    content: `## The Box Model

Every element in CSS is a rectangular box. From outside to inside:

\`\`\`
┌─────────────────────────────────────┐  ← margin
│  ┌───────────────────────────────┐  │
│  │ border                        │  │
│  │ ┌─────────────────────────┐   │  │
│  │ │ padding                 │   │  │
│  │ │ ┌───────────────────┐   │   │  │
│  │ │ │  content (width   │   │   │  │
│  │ │ │  x height)        │   │   │  │
│  │ │ └───────────────────┘   │   │  │
│  │ └─────────────────────────┘   │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
\`\`\`

## Box Properties

\`\`\`css
div {
  width: 300px;
  height: 200px;

  /* Padding: space inside, pushes content away from border */
  padding: 20px;           /* all 4 sides */
  padding: 10px 20px;      /* top/bottom, left/right */
  padding: 10px 20px 30px; /* top, left/right, bottom */
  padding: 10px 20px 30px 40px; /* top, right, bottom, left (clockwise) */

  /* Border: line around element */
  border: 2px solid black;
  border-radius: 8px;

  /* Margin: space outside, pushes other elements away */
  margin: 20px;

  /* Box sizing affects width/height calculation */
  box-sizing: content-box; /* default: width = content only */
  box-sizing: border-box;  /* width = content + padding + border */
}
\`\`\`

## box-sizing: A Critical Choice

\`\`\`css
/* ❌ content-box (default) */
.box {
  width: 300px;
  padding: 20px;
  border: 2px solid;
  /* Total width = 300 + 20*2 + 2*2 = 348px */
}

/* ✓ border-box (recommended) */
* {
  box-sizing: border-box;
}
.box {
  width: 300px;
  padding: 20px;
  border: 2px solid;
  /* Total width = 300px (padding and border included) */
}
\`\`\`

**Always use \`box-sizing: border-box\` globally.** It makes math predictable.

## Margin Collapse

Adjacent vertical margins collapse into one (the larger wins).

\`\`\`css
.parent {
  background: gray;
  padding: 0; /* ❌ margin of child collapses into parent */
}
.child {
  margin-top: 20px;
  background: white;
}

/* Result: .child has 0 space from parent top */
\`\`\`

**Fix:**
\`\`\`css
.parent {
  padding-top: 1px; /* OR overflow: hidden; */
}
\`\`\`

## Common Pattern

\`\`\`css
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;      /* Center horizontally */
  padding: 0 20px;     /* Breathing room on mobile */
}
\`\`\`

## Visibility & Display

\`\`\`css
/* Element takes no space in layout */
display: none;

/* Element takes space but invisible */
visibility: hidden;

/* Element invisible but interactive */
opacity: 0;

/* Best for animations */
visibility: hidden;
transition: visibility 0.3s;
\`\`\`
`,
    contentHi: `## Box Model

Har CSS element ek rectangular box hai. Bahar se andar:

\`\`\`
margin → border → padding → content
\`\`\`

## Box Properties

\`\`\`css
div {
  width: 300px;
  height: 200px;

  /* Padding: content se paas */
  padding: 20px;

  /* Border: line */
  border: 2px solid black;

  /* Margin: bahar ka space */
  margin: 20px;

  /* Box sizing critical hai */
  box-sizing: border-box; /* Use yeh hamesha */
}
\`\`\`

## box-sizing

\`\`\`css
/* border-box use karo globally */
* {
  box-sizing: border-box;
}
\`\`\`

\`border-box\` se width mein padding aur border included hota hai. Calculation easy rahe.

## Margin Collapse

Vertical margins adjacent elements mein collapse hote hain (zyada wala jeeta).

\`\`\`css
.parent {
  padding-top: 1px; /* Fix: overflow:hidden ya ye */
}
.child {
  margin-top: 20px;
}
\`\`\`
`,
    simple: `Every element is a box with content, padding (inside space), border, and margin (outside space). Use \`box-sizing: border-box\` globally so width includes padding and border. Vertical margins of adjacent elements collapse.`,
    simpleHi: `Har element ek box hai: content, padding, border, margin. \`box-sizing: border-box\` use karo globally. Vertical margins collapse hote hain.`,
    tricks: `\`box-sizing: border-box\` on all elements saves hours. Vertical margins collapse—use padding on parent if needed.`,
    tricksHi: `\`border-box\` ghante bach leta hai. Vertical margins collapse—parent par padding use karo.`,
    codeExample: `<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}

.card {
  width: 300px;
  padding: 20px;
  border: 1px solid #ddd;
  margin: 10px;
  border-radius: 8px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
</style>

<div class="container">
  <div class="card">Content here</div>
</div>`,
    expectedOutput: `Card renders with proper spacing, width calculations work correctly`,
    commonMistakes: [
      'Forgetting \`box-sizing: border-box\`',
      'Not resetting \`margin: 0\` on body',
      'Confusion between padding and margin',
      'Unexpected margin collapse',
    ],
    interviewQuestions: [
      'Explain the CSS box model',
      'What is the difference between margin and padding?',
      'Why should you use \`box-sizing: border-box\`?',
      'What is margin collapse and when does it happen?',
    ],
    practiceQuestions: [
      'Build a card component with proper spacing',
      'Explain box model with a visual example',
      'Calculate final element width with complex padding/border',
    ],
    relatedProblemSlugs: [],
    tags: ['css', 'box-model', 'layout', 'fundamentals'],
  },

  {
    slug: 'css-flexbox-mastery',
    title: 'Flexbox: The Modern Layout',
    category: 'Layout (Flexbox & Grid)',
    difficulty: 'MEDIUM',
    summary: 'Master flexbox for 1D layouts. Align, distribute, and manage space with ease.',
    content: `## Flexbox Basics

Flexbox handles **1D layout**—rows or columns.

\`\`\`css
.container {
  display: flex;
  /* Now all children are flex items */
}
\`\`\`

## Container Properties

\`\`\`css
.flex-container {
  display: flex;

  /* Direction: row (default) or column */
  flex-direction: row;      /* left to right */
  flex-direction: column;   /* top to bottom */
  flex-direction: row-reverse;
  flex-direction: column-reverse;

  /* Wrap to next line if space runs out */
  flex-wrap: nowrap;        /* default: compress items */
  flex-wrap: wrap;          /* next line */
  flex-wrap: wrap-reverse;

  /* Justify: align along main axis (row: horizontal, column: vertical) */
  justify-content: flex-start;    /* default */
  justify-content: center;        /* center items */
  justify-content: space-between; /* push to ends, space in middle */
  justify-content: space-around;  /* space around each item */
  justify-content: space-evenly;  /* even space everywhere */

  /* Align: align along cross axis (perpendicular) */
  align-items: stretch;      /* default: fill cross axis */
  align-items: flex-start;
  align-items: center;
  align-items: flex-end;
  align-items: baseline;

  /* When wrapped: align rows/columns */
  align-content: space-between;
  align-content: center;
}
\`\`\`

## Item Properties

\`\`\`css
.flex-item {
  /* Grow to fill space (1 = equal share) */
  flex-grow: 0;       /* default: don't grow */
  flex-grow: 1;       /* grow equally */

  /* Shrink when space runs out (1 = participate in shrinking) */
  flex-shrink: 1;     /* default */
  flex-shrink: 0;     /* don't shrink */

  /* Base size before growing/shrinking */
  flex-basis: auto;   /* default: size by content */
  flex-basis: 200px;  /* start at 200px, then grow/shrink */

  /* Shorthand: flex-grow, flex-shrink, flex-basis */
  flex: 1;            /* same as: 1 1 0 (grow, shrink, basis) */
  flex: 0 0 200px;    /* fixed 200px */

  /* Override align-items for this item */
  align-self: flex-end;
  align-self: center;

  /* Reorder items (default: 0) */
  order: 1;
}
\`\`\`

## Common Patterns

**Center item:**
\`\`\`css
.container {
  display: flex;
  justify-content: center;  /* horizontal */
  align-items: center;      /* vertical */
  height: 100vh;
}
\`\`\`

**Navbar (logo left, menu right):**
\`\`\`css
.navbar {
  display: flex;
  justify-content: space-between;
}
\`\`\`

**Card with footer at bottom:**
\`\`\`css
.card {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.card-content {
  flex: 1; /* grow to fill */
}
.card-footer {
  /* stays at bottom */
}
\`\`\`

**Equal width columns:**
\`\`\`css
.container {
  display: flex;
}
.item {
  flex: 1; /* equal share */
}
\`\`\`

## Flexbox vs Block Layout

\`\`\`css
/* Block (one per line) */
display: block;

/* Inline (side by side, but respects padding) */
display: inline-block;

/* Flexbox (side by side, flexible) */
display: flex;
\`\`\`
`,
    contentHi: `## Flexbox

1D layout ke liye. Row ya column.

\`\`\`css
.container {
  display: flex;
}
\`\`\`

## Container Properties

\`\`\`css
.flex-container {
  display: flex;
  flex-direction: row;      /* ya column */
  justify-content: space-between;  /* main axis */
  align-items: center;             /* cross axis */
}
\`\`\`

## Item Properties

\`\`\`css
.flex-item {
  flex: 1;  /* grow equally */
}
\`\`\`

## Common Patterns

**Center:**
\`\`\`css
display: flex;
justify-content: center;
align-items: center;
\`\`\`

**Navbar (left-right):**
\`\`\`css
justify-content: space-between;
\`\`\`

**Equal columns:**
\`\`\`css
.item {
  flex: 1;
}
\`\`\`
`,
    simple: `Flexbox (\`display: flex\`) arranges items in rows or columns. Use \`justify-content\` to align along the main axis, \`align-items\` for the cross axis. \`flex: 1\` makes items grow equally.`,
    simpleHi: `Flexbox rows ya columns arrange karta hai. \`justify-content\` main axis par, \`align-items\` cross axis par. \`flex: 1\` equal growth.`,
    tricks: `\`flex: 1\` for equal share. \`justify-content: space-between\` for navbar. \`flex-direction: column\` to switch axis.`,
    tricksHi: `\`flex: 1\` equal growth. \`justify-content: space-between\` navbar ke liye. Column direction se axis badal jata hai.`,
    codeExample: `<style>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #333;
}

.nav-item {
  color: white;
  flex: 1;
}

.container {
  display: flex;
  gap: 1rem;
  padding: 1rem;
}

.card {
  flex: 1;
  border: 1px solid #ddd;
  padding: 1rem;
}
</style>

<nav class="navbar">
  <div>Logo</div>
  <div class="nav-item">Home</div>
  <div class="nav-item">About</div>
</nav>

<div class="container">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  <div class="card">Card 3</div>
</div>`,
    expectedOutput: `Navbar with items spaced evenly, equal-width cards below`,
    commonMistakes: [
      'Confusing main axis and cross axis',
      'Using \`width: 100%\` instead of \`flex: 1\`',
      'Not setting gap between items',
      'Forgetting \`flex-wrap\` for responsive design',
    ],
    interviewQuestions: [
      'Explain the difference between justify-content and align-items',
      'What does \`flex: 1\` do?',
      'How do you center an item with flexbox?',
      'Explain flex-direction and how it changes the axes',
    ],
    practiceQuestions: [
      'Build a responsive navbar with flexbox',
      'Create a 3-column layout that wraps on mobile',
      'Implement a card with title, content, and footer using flexbox',
    ],
    relatedProblemSlugs: [],
    tags: ['css', 'flexbox', 'layout', 'alignment'],
  },

  {
    slug: 'css-grid-layout',
    title: 'CSS Grid: 2D Layout Power',
    category: 'Layout (Flexbox & Grid)',
    difficulty: 'MEDIUM',
    summary: 'Master CSS Grid for 2D layouts. Rows, columns, gaps, and complex responsive layouts.',
    content: `## Grid Basics

Grid handles **2D layout**—rows AND columns simultaneously.

\`\`\`css
.container {
  display: grid;
  /* Define columns and rows */
  grid-template-columns: 200px 1fr 200px;  /* 3 columns */
  grid-template-rows: auto 1fr auto;       /* 3 rows */
}
\`\`\`

## Column & Row Definition

\`\`\`css
.grid {
  display: grid;

  /* Explicit 3 equal columns */
  grid-template-columns: 1fr 1fr 1fr;

  /* Auto-repeat: fill space with 250px columns */
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));

  /* Mix units */
  grid-template-columns: 200px 1fr 100px;

  /* Rows (auto: content height) */
  grid-template-rows: auto 200px auto;

  /* Gaps between items */
  gap: 20px;
  column-gap: 20px;
  row-gap: 20px;
}
\`\`\`

## Item Positioning

\`\`\`css
.item {
  /* Span 2 columns */
  grid-column: span 2;
  /* or explicit start/end */
  grid-column: 1 / 3;

  /* Span 3 rows */
  grid-row: span 3;
  grid-row: 2 / 5;

  /* Align within cell */
  justify-self: center;   /* horizontal */
  align-self: center;     /* vertical */
}
\`\`\`

## Named Grid Areas

\`\`\`css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 10px;

  /* Define layout visually */
  grid-template-areas:
    "header header header"
    "sidebar content content"
    "footer footer footer";
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.content { grid-area: content; }
.footer { grid-area: footer; }
\`\`\`

## Responsive Grid

\`\`\`css
/* Mobile: 1 column */
.grid {
  display: grid;
  grid-template-columns: 1fr;
}

/* Tablet: 2 columns */
@media (min-width: 768px) {
  .grid {
    grid-template-columns: 1fr 1fr;
  }
}

/* Desktop: 3 columns with auto-fit */
@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
}

/* Or in one line: */
.grid {
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
\`\`\`

## Grid vs Flexbox

| Use | Grid | Flexbox |
|-----|------|---------|
| 1D (row/col) | Works but overkill | Perfect |
| 2D (rows + cols) | Perfect | Awkward |
| Complex layouts | Easy | Nested containers |
| Alignment | Both axes built-in | One axis native |

**Rule:** Flexbox for components, Grid for page layouts.

\`\`\`css
/* Page layout: grid */
.page {
  display: grid;
  grid-template-areas:
    "sidebar header header"
    "sidebar content content";
}

/* Navigation: flexbox */
.header {
  display: flex;
  justify-content: space-between;
}
\`\`\`
`,
    contentHi: `## Grid

2D layout. Rows aur columns dono.

\`\`\`css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto 1fr auto;
}
\`\`\`

## Columns aur Rows

\`\`\`css
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
gap: 20px;
\`\`\`

## Responsive

\`\`\`css
@media (min-width: 768px) {
  grid-template-columns: 1fr 1fr;
}
\`\`\`

## Grid vs Flexbox

- **Flexbox:** 1D (row ya column)
- **Grid:** 2D (rows + columns)
`,
    simple: `CSS Grid arranges items in 2D (rows and columns). \`grid-template-columns\` defines columns, \`gap\` adds space. \`repeat(auto-fit, minmax(250px, 1fr))\` creates responsive columns.`,
    simpleHi: `Grid 2D layout karta hai. \`grid-template-columns\` columns define karo, \`gap\` space do. Responsive columns ke liye \`repeat(auto-fit, minmax())\`.`,
    tricks: `\`repeat(auto-fit, minmax(250px, 1fr))\` = responsive columns that wrap. Grid for page layout, Flexbox for components.`,
    tricksHi: `\`repeat(auto-fit, minmax(250px, 1fr))\` = responsive columns. Grid layouts ke liye, Flexbox components ke liye.`,
    codeExample: `<style>
.page {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  gap: 1rem;
  min-height: 100vh;

  grid-template-areas:
    "header header header"
    "sidebar content sidebar"
    "footer footer footer";
}

.header { grid-area: header; background: #333; }
.sidebar { grid-area: sidebar; background: #f5f5f5; }
.content { grid-area: content; }
.footer { grid-area: footer; background: #333; }

@media (max-width: 768px) {
  .page {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "content"
      "footer";
  }
}
</style>

<div class="page">
  <header>Header</header>
  <aside class="sidebar">Sidebar</aside>
  <main class="content">Content</main>
  <footer>Footer</footer>
</div>`,
    expectedOutput: `3-column layout on desktop, 1-column on mobile`,
    commonMistakes: [
      'Using Grid when Flexbox is simpler',
      'Complex grid-template when auto-fit would work',
      'Not using gap (spacing with margins instead)',
      'Forgetting media queries for responsive design',
    ],
    interviewQuestions: [
      'Explain when to use Grid vs Flexbox',
      'How does \`repeat(auto-fit, minmax())\` work?',
      'What is grid-template-areas and why use it?',
      'How do you make a Grid responsive?',
    ],
    practiceQuestions: [
      'Create a 3-column layout with header/footer using Grid',
      'Build a responsive image gallery with auto-fit columns',
      'Implement a dashboard layout with Grid areas',
    ],
    relatedProblemSlugs: [],
    tags: ['css', 'grid', 'layout', '2d-layout'],
  },
];
