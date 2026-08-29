import type { SeedCategory } from './topics-shared';

export const htmlCategory: SeedCategory = {
  slug: 'html',
  name: 'HTML',
  description: 'Semantic markup, forms, accessibility, and web standards. The foundation of every web page.',
  icon: 'code',
  group: 'web-dev',
  topics: [
    {
      slug: 'html-document-structure',
      title: 'HTML Document Structure & Semantics',
      difficulty: 'EASY',
      summary: 'Understand proper HTML document structure, semantic elements, and the difference between presentation and meaning.',
      summaryHi: 'HTML document structure aur semantic elements samjho. \`<div>\` ki jaga meaningful tags use karo.',
      content: `## The HTML Document

Every HTML document is a tree structure:

\`\`\`html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title</title>
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    <!-- Content goes here -->
  </body>
</html>
\`\`\`

## Structure Breakdown

**\`<!DOCTYPE html>\`** — Tells browser this is HTML5. Must be first.

**\`<head>\`** — Metadata and resources:
- \`<meta charset="UTF-8">\` — Character encoding
- \`<meta name="viewport">\` — Mobile viewport (critical for responsive)
- \`<title>\` — Page title (browser tab, Google results)
- \`<link>\` — CSS, fonts, icons
- \`<script>\` — JS (put at end of body)

**\`<body>\`** — All visible content.

## Semantic HTML

Use meaningful elements instead of \`<div>\` everywhere:

| Element | When to Use |
|---------|------------|
| \`<header>\` | Top of page or start of \`<article>\` |
| \`<nav>\` | Navigation links, menu |
| \`<main>\` | Primary content (once per page) |
| \`<article>\` | Self-contained content (blog post) |
| \`<section>\` | Thematic grouping (with heading) |
| \`<aside>\` | Related but separate (sidebar) |
| \`<footer>\` | End content (copyright, links) |

**Why semantics matter:**
1. SEO — Search engines understand structure
2. Accessibility — Screen readers navigate landmarks
3. Maintainability — Code reads like English
4. Styling hooks — CSS can be more semantic

## Common Mistakes

❌ Using \`<div>\` for everything
❌ Multiple \`<main>\` elements
❌ Nested \`<header>\` or \`<footer>\`
✓ One \`<main>\` per page
✓ \`<header>\` and \`<footer>\` can be inside \`<article>\`
✓ \`<section>\` must have a heading`,
      contentHi: `## HTML Document Structure

\`<!DOCTYPE html>\` se shuru karo.

## Head mein

- \`<meta charset="UTF-8">\` — Encoding
- \`<meta name="viewport">\` — Mobile ke liye zaroori
- \`<title>\` — Page ka naam
- \`<link>\` — CSS, fonts
- \`<script>\` — JS (last mein)

## Semantic Elements

Meaningful tags use karo:

\`\`\`html
<header>My Blog</header>
<main>
  <article>Article</article>
</main>
<footer>© 2024</footer>
\`\`\`

**Fayda:** SEO, accessibility, readable code

## Mistakes

❌ Har jaga \`<div>\`
✓ Semantic elements use karo`,
      codeExample: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Blog</title>
</head>
<body>
  <header>
    <h1>My Blog</h1>
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
    </nav>
  </header>

  <main>
    <article>
      <h2>First Post</h2>
      <p>Content here...</p>
    </article>
  </main>

  <footer>© 2024 My Blog</footer>
</body>
</html>`,
      expectedOutput: `Well-structured HTML document with semantic elements`,
      commonMistakes: [
        'Using \`<div>\` for everything',
        'Forgetting viewport meta tag',
        'Multiple \`<main>\` elements',
        'Not using semantic elements',
      ],
      interviewQuestions: [
        'What is semantic HTML and why does it matter?',
        'What should always go in \`<head>\`?',
        'Why is the viewport meta tag important?',
      ],
      practiceQuestions: [
        'Create a blog homepage with proper semantic structure',
        'Explain why \`<div>\` should be a last resort',
      ],
      tags: ['html', 'semantics', 'structure', 'fundamentals'],
    },
    {
      slug: 'html-forms-and-input',
      title: 'Forms, Input Elements & Validation',
      difficulty: 'MEDIUM',
      summary: 'Master form elements, input types, validation, and accessibility for forms.',
      summaryHi: 'Forms ke elements, input types, HTML5 validation aur accessibility samjho.',
      content: `## The \`<form>\` Element

\`\`\`html
<form action="/submit" method="POST">
  <!-- Form controls -->
  <button type="submit">Submit</button>
</form>
\`\`\`

**Attributes:**
- \`action\` — URL to send form data to
- \`method\` — GET (visible) or POST (secure)
- \`enctype\` — \`application/x-www-form-urlencoded\` (default) or \`multipart/form-data\` (files)

## Input Types

\`\`\`html
<input type="text" name="firstName">
<input type="email" name="email">
<input type="password" name="password">
<input type="number" name="age" min="0" max="120">
<input type="date" name="birthDate">
<input type="checkbox" name="agree">
<input type="radio" name="size" value="small">
<input type="file" name="photo">

<select name="country">
  <option value="us">USA</option>
</select>

<textarea name="bio" rows="4"></textarea>
\`\`\`

## HTML5 Validation

\`\`\`html
<input type="email" required>
<input type="text" minlength="5" maxlength="20">
<input type="number" min="1" max="100">
<input type="text" pattern="[A-Z]{3}" title="3 uppercase letters">
\`\`\`

**Note:** Validation is for UX, not security. Always validate on server too.

## Accessibility

**Always use \`<label>\`:**
\`\`\`html
<label for="email">Email:</label>
<input type="email" id="email">
\`\`\`

\`<label>\` increases click target and helps screen readers.

**Group related inputs:**
\`\`\`html
<fieldset>
  <legend>Address</legend>
  <input type="text" placeholder="Street">
  <input type="text" placeholder="City">
</fieldset>
\`\`\``,
      contentHi: `## Form Elements

\`\`\`html
<form action="/submit" method="POST">
  <input type="email" name="email" required>
  <textarea name="message"></textarea>
  <button type="submit">Submit</button>
</form>
\`\`\`

## Input Types

\`\`\`html
<input type="email">
<input type="number" min="0" max="120">
<input type="date">
<input type="checkbox">
<input type="file">
\`\`\`

## Validation

\`\`\`html
<input type="email" required>
<input type="text" minlength="5" maxlength="20">
\`\`\`

## Accessibility

Hamesha \`<label>\` use karo:
\`\`\`html
<label for="email">Email:</label>
<input type="email" id="email">
\`\`\``,
      codeExample: `<form action="/signup" method="POST">
  <fieldset>
    <legend>Sign Up</legend>

    <label for="email">Email:</label>
    <input type="email" id="email" name="email" required>

    <label for="password">Password:</label>
    <input type="password" id="password" name="password" minlength="8" required>

    <label for="country">Country:</label>
    <select id="country" name="country">
      <option value="">Select...</option>
      <option value="us">USA</option>
      <option value="uk">UK</option>
    </select>

    <label for="terms">
      <input type="checkbox" id="terms" name="terms" required>
      I agree to terms
    </label>

    <button type="submit">Sign Up</button>
  </fieldset>
</form>`,
      expectedOutput: `Accessible form with proper labels and validation`,
      commonMistakes: [
        'Forgetting \`<label>\` elements',
        'Using placeholder instead of \`<label>\`',
        'Not validating on server',
        'Missing \`name\` attributes',
      ],
      interviewQuestions: [
        'What is the difference between GET and POST?',
        'Why is \`<label>\` important for accessibility?',
        'Explain HTML5 form validation',
      ],
      practiceQuestions: [
        'Build a login form with validation',
        'Create a multi-step form with fieldsets',
      ],
      tags: ['html', 'forms', 'input', 'validation', 'accessibility'],
    },
    {
      slug: 'html-accessibility-a11y',
      title: 'Accessibility Fundamentals (a11y)',
      difficulty: 'MEDIUM',
      summary: 'Make HTML accessible to all users. ARIA, semantic markup, and WCAG best practices.',
      summaryHi: 'Accessibility ke liye semantic HTML use karo. ARIA aur screen readers samjho.',
      content: `## What is Accessibility?

Design for all users:
- Blind/low vision (screen readers)
- Deaf (captions)
- Motor disabilities (keyboard navigation)
- Cognitive disabilities (clear language)

## Semantic HTML = Accessible HTML

Semantic elements provide:
- Keyboard navigation (built-in)
- Screen reader announcements
- Correct focus management
- No ARIA needed

\`\`\`html
<!-- ❌ Not accessible -->
<div class="btn" onclick="handleClick()">Click</div>

<!-- ✓ Accessible -->
<button onclick="handleClick()">Click</button>
\`\`\`

## Keyboard Navigation

Interactive elements are focusable by default: \`<button>\`, \`<a>\`, \`<input>\`, \`<select>\`

\`\`\`html
<button>Focusable</button>
<div tabindex="0">Can be focused</div>
<div tabindex="-1">Hidden from tab order</div>
\`\`\`

## ARIA (Accessible Rich Internet Applications)

For custom widgets when semantic HTML isn't enough:

\`\`\`html
<button aria-label="Close">✕</button>
<div aria-live="polite">New message</div>
<input aria-describedby="help-text">
<span id="help-text">3-20 characters, no spaces</span>
\`\`\`

## Images & Icons

\`\`\`html
<!-- ✓ Descriptive alt text -->
<img src="dog.jpg" alt="Golden retriever playing fetch">

<!-- ✓ Empty alt for decorative images -->
<img src="divider.svg" alt="">

<!-- Icon button -->
<button aria-label="Search">🔍</button>
\`\`\`

## Color & Contrast

**WCAG AA Standard:**
- Normal text: 4.5:1 minimum contrast ratio
- Large text: 3:1 minimum

## Testing

- Keyboard only: Tab navigate everything?
- Screen reader: NVDA (Windows) or VoiceOver (Mac)
- Color contrast: WebAIM Contrast Checker`,
      contentHi: `## Accessibility kya hai?

Sabke liye design karo:
- Blind log (screen readers)
- Deaf log (captions)
- Motor disability (keyboard)

## Semantic HTML = Accessible

\`<button>\` ko automatically keyboard support miलता है.

## ARIA

Custom widgets ke liye:
\`\`\`html
<button aria-label="Close">✕</button>
\`\`\`

## Images

\`\`\`html
<img src="dog.jpg" alt="Golden retriever playing">
\`\`\`

## Testing

- Keyboard se navigate kro
- Screen reader use kro
- Color contrast check kro`,
      codeExample: `<html lang="en">
<body>
  <a href="#main" class="skip-link">Skip to content</a>

  <header>
    <h1>My Site</h1>
    <nav>
      <a href="/">Home</a>
    </nav>
  </header>

  <main id="main">
    <article>
      <h2>Article</h2>
      <img src="hero.jpg" alt="Mountain at sunset">
      <p>Content...</p>
    </article>
  </main>

  <footer>© 2024</footer>
</body>
</html>`,
      expectedOutput: `Accessible website navigable by keyboard and screen readers`,
      commonMistakes: [
        'Missing alt text on images',
        'Low contrast text',
        'Using \`<div>\` instead of \`<button>\`',
        'Not testing with keyboard/screen reader',
      ],
      interviewQuestions: [
        'What does "a11y" mean?',
        'When should you use ARIA?',
        'How do you make an icon button accessible?',
      ],
      practiceQuestions: [
        'Audit a website for accessibility',
        'Add a11y improvements to a page',
      ],
      tags: ['html', 'accessibility', 'aria', 'wcag'],
    },
  ],
};
