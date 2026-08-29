import type { SeedCategory } from './topics-shared';

export const cssCategory: SeedCategory = {
  slug: 'css',
  name: 'CSS',
  description: 'Styling, layout, responsive design, and animations. From box model to award-winning interactions.',
  icon: 'paint-brush',
  group: 'web-dev',
  topics: [
    {
      slug: 'css-box-model',
      title: 'The Box Model',
      difficulty: 'EASY',
      summary: 'Understand the CSS box model: margin, border, padding, and content. The foundation of all layout.',
      summaryHi: 'Box model samjho: content, padding, border, margin. box-sizing: border-box hamesha use karo.',
      content: `Every element is a rectangular box with content, padding, border, and margin from inside to outside.

The box model: margin → border → padding → content (width × height)

Box Model Properties:
- padding: space inside, pushes content away
- border: line around element
- margin: space outside, pushes elements away
- box-sizing: border-box (include padding and border in width)

CRITICAL: Always use box-sizing: border-box globally. This makes width calculations predictable.

Without box-sizing border-box, a 300px element with 20px padding becomes 348px wide.
With box-sizing border-box, it stays 300px.

Margin Collapse: Adjacent vertical margins collapse into one (larger wins).
Fix: Add padding-top: 1px to parent.

Common Pattern:
* { box-sizing: border-box; }
body { margin: 0; padding: 0; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }`,
      contentHi: `Box model: margin → border → padding → content

Always use: box-sizing: border-box;

Margin collapse fix: parent par padding-top: 1px add karo.`,
      codeExample: `* { box-sizing: border-box; }
body { margin: 0; }
.card { width: 300px; padding: 20px; margin: 10px; }`,
      expectedOutput: `Card renders with proper spacing`,
      commonMistakes: [
        'Forgetting box-sizing: border-box',
        'Not resetting margin on body',
        'Confusion between padding and margin',
        'Unexpected margin collapse'
      ],
      interviewQuestions: [
        'Explain the CSS box model',
        'What is margin collapse and when does it happen?',
        'Why use box-sizing: border-box?'
      ],
      practiceQuestions: [
        'Build a card component with proper spacing',
        'Calculate element width with complex padding/border'
      ],
      tags: ['css', 'box-model', 'layout', 'fundamentals'],
    },
    {
      slug: 'css-flexbox-mastery',
      title: 'Flexbox: The Modern Layout',
      difficulty: 'MEDIUM',
      summary: 'Master flexbox for 1D layouts. Align, distribute, and manage space with ease.',
      summaryHi: 'Flexbox 1D layout handle karta hai. justify-content main axis, align-items cross axis.',
      content: `Flexbox handles 1D layout—rows or columns.

Container Properties:
- display: flex
- flex-direction: row (default) or column
- justify-content: main axis alignment (flex-start, center, space-between, space-around)
- align-items: cross axis alignment (center, flex-start, flex-end, stretch)
- gap: space between items

Item Properties:
- flex: 1 (grow equally)
- flex: 0 0 200px (fixed size)
- align-self: override align-items for this item

Common Patterns:
1. Center: justify-content: center; align-items: center;
2. Navbar: justify-content: space-between;
3. Equal columns: flex: 1 on each item

Flexbox is perfect for 1D layouts. Use Grid for 2D.`,
      contentHi: `Flexbox 1D layout: row ya column.

Container: display flex + justify-content + align-items + gap

Item: flex property for growth

Center: justify-content center + align-items center
Navbar: justify-content space-between
Equal columns: flex 1`,
      codeExample: `.navbar { display: flex; justify-content: space-between; }
.card { flex: 1; }`,
      expectedOutput: `Items aligned with flexbox`,
      commonMistakes: [
        'Confusing main axis and cross axis',
        'Using width 100% instead of flex 1',
        'Not using gap'
      ],
      interviewQuestions: [
        'Explain justify-content vs align-items',
        'What does flex 1 do?',
        'How do you center with flexbox?'
      ],
      practiceQuestions: [
        'Build a responsive navbar with flexbox',
        'Create a 3-column layout that wraps'
      ],
      tags: ['css', 'flexbox', 'layout', 'alignment'],
    },
    {
      slug: 'css-grid-layout',
      title: 'CSS Grid: 2D Layout Power',
      difficulty: 'MEDIUM',
      summary: 'Master CSS Grid for 2D layouts. Rows, columns, gaps, and complex responsive layouts.',
      summaryHi: 'Grid 2D layout handle karta hai. Rows aur columns dono define karo.',
      content: `CSS Grid handles 2D layout—rows AND columns simultaneously.

Basic Grid:
display: grid
grid-template-columns: 1fr 1fr 1fr (3 equal columns)
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)) (responsive)
grid-template-rows: auto 1fr auto
gap: 20px

Responsive Grid:
Use auto-fit or auto-fill with minmax for responsive columns
Mobile: 1 column
Tablet: 2 columns
Desktop: 3+ columns

Named Areas:
grid-template-areas: "header header" "sidebar content" "footer footer"
grid-area: header/sidebar/content/footer

Grid vs Flexbox:
- Use Flexbox for 1D (row or column only)
- Use Grid for 2D (rows and columns together)
- Grid for page layouts, Flexbox for components

repeat(auto-fit, minmax(300px, 1fr)) creates columns that automatically wrap based on screen size.`,
      contentHi: `Grid 2D layout: rows aur columns.

display: grid
grid-template-columns: 1fr 1fr 1fr
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)) - responsive
gap: 20px

Responsive: auto-fit use karo

Grid page layouts ke liye, Flexbox components ke liye.`,
      codeExample: `.page { display: grid; grid-template-columns: 200px 1fr; gap: 1rem; }
@media (max-width: 768px) { .page { grid-template-columns: 1fr; } }`,
      expectedOutput: `2-column layout on desktop, 1-column on mobile`,
      commonMistakes: [
        'Using Grid when Flexbox is simpler',
        'Not using media queries',
        'Complex grid-template when auto-fit works'
      ],
      interviewQuestions: [
        'When to use Grid vs Flexbox?',
        'How does repeat(auto-fit, minmax()) work?',
        'What is grid-template-areas?'
      ],
      practiceQuestions: [
        'Create a 3-column layout with Grid',
        'Build a responsive image gallery',
        'Implement a dashboard layout'
      ],
      tags: ['css', 'grid', 'layout', '2d-layout'],
    },
  ],
};
