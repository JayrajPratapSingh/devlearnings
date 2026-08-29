import type { SeedProblem } from './shared';

/**
 * HTML — Semantic markup, forms, accessibility, and web standards.
 * Covers fundamentals through advanced patterns.
 */

export const HTML_CATEGORIES = [
  'HTML Fundamentals',
  'Semantic HTML',
  'Forms & Validation',
  'Accessibility (a11y)',
  'Web APIs & Meta',
] as const;

export const htmlTopics = [
  /* ────────────────────── HTML Fundamentals ────────────────────── */
  {
    slug: 'html-document-structure',
    title: 'HTML Document Structure & Semantics',
    category: 'HTML Fundamentals',
    difficulty: 'EASY',
    summary: 'Understand proper HTML document structure, semantic elements, and the difference between presentation and meaning.',
    content: `## The HTML Document

Every HTML document is a tree structure starting with a \`<!DOCTYPE>\` declaration.

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
    <script src="script.js"></script>
  </body>
</html>
\`\`\`

## Structure Breakdown

**\`<!DOCTYPE html>\`** — Tells the browser this is HTML5. Must be first, not case-sensitive.

**\`<html lang="en">\`** — Root element. The \`lang\` attribute helps screen readers and translation tools.

**\`<head>\`** — Metadata and resources:
- \`<meta charset="UTF-8">\` — Character encoding (must be in first 1024 bytes)
- \`<meta name="viewport" ...>\` — Mobile viewport settings (critical for responsive design)
- \`<title>\`  — Page title (shown in browser tab, Google results)
- \`<link>\` — External resources (CSS, fonts, icons)
- \`<style>\` — Internal CSS
- \`<script>\` — Internal JS (but defer to end of \`<body>\`)

**\`<body>\`** — All visible content. Scripts go at the bottom (or use \`async\`/\`defer\`).

## Semantic HTML

**Bad (presentation over meaning):**
\`\`\`html
<div class="header">My Blog</div>
<div class="post">
  <div class="title">Article Title</div>
  <div class="content">...</div>
</div>
<div class="footer">© 2024</div>
\`\`\`

**Good (semantic elements):**
\`\`\`html
<header>
  <h1>My Blog</h1>
</header>
<main>
  <article>
    <h2>Article Title</h2>
    <p>Content...</p>
  </article>
</main>
<footer>© 2024</footer>
\`\`\`

## Semantic Elements

| Element | Meaning | When to Use |
|---------|---------|------------|
| \`<header>\` | Introductory content | Top of page, or start of \`<article>\` |
| \`<nav>\` | Navigation links | Main menu, breadcrumbs, TOC |
| \`<main>\` | Primary content | Once per page, the "meat" |
| \`<article>\` | Self-contained content | Blog post, news article, comment |
| \`<section>\` | Thematic grouping | Chapter, topic, major part of content |
| \`<aside>\` | Related but separate | Sidebar, callout, "see also" |
| \`<footer>\` | End content | Copyright, links, author info |

## Why Semantics Matter

1. **SEO** — Search engines understand structure
2. **Accessibility** — Screen readers navigate by semantic landmarks
3. **Maintainability** — Your code reads like English
4. **Styling hooks** — CSS can be more semantic

## Common Mistakes

❌ Using \`<div>\` for everything
❌ Nested \`<header>\` or \`<footer>\`
❌ Multiple \`<main>\` elements
✓ One \`<main>\` per page
✓ \`<header>\` and \`<footer>\` can be inside \`<article>\`
✓ \`<section>\` must have a heading
`,
    contentHi: `## HTML Document

Har HTML document ek tree structure hai jo \`<!DOCTYPE>\` se shuru hota hai.

\`\`\`html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Page Title</title>
  </head>
  <body>
    <!-- Content yahan -->
  </body>
</html>
\`\`\`

## Structure

**\`<!DOCTYPE html>\`** — Batata hai yeh HTML5 hai. Sabse pehle hona chahiye.

**\`<head>\`** — Metadata aur resources:
- \`<meta charset="UTF-8">\` — Character encoding
- \`<title>\` — Page ka naam (browser tab mein dikhe)
- \`<link>\` — CSS, fonts, icons
- \`<meta name="viewport">\` — Mobile devices ke liye zaroori

**\`<body>\`** — Visible content. Scripts last mein.

## Semantic HTML

Semantic elements ka matlab hota hai—\`<div>\` ki jaga meaningful names use karo.

\`\`\`html
<header>My Blog</header>
<main>
  <article>Article Title</article>
</main>
<footer>© 2024</footer>
\`\`\`

**Fayda:**
- Search engines samjhe code ko
- Screen readers navigate kar paayen
- Code readable rahta hai
`,
    simple: `HTML gives structure to web pages. Use semantic tags like \`<header>\`, \`<main>\`, \`<article>\`, \`<footer>\` instead of \`<div>\` everywhere. It makes the code meaningful to both humans and machines.`,
    simpleHi: `HTML web pages ko structure deta hai. \`<div>\` ki jaga semantic tags use karo like \`<header>\`, \`<main>\`, \`<article>\`, \`<footer>\`. Code meaningful ban jata hai.`,
    tricks: `One \`<main>\` per page. \`<section>\` needs a heading. \`<header>\` and \`<footer>\` can repeat (e.g., one for page, one for article).`,
    tricksHi: `Ek hi \`<main>\` page mein. \`<section>\` ko heading chahiye. \`<header>\` aur \`<footer>\` repeat ho sakte hain.`,
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

  <footer>
    © 2024 My Blog
  </footer>
</body>
</html>`,
    expectedOutput: `Well-structured HTML document with semantic elements`,
    commonMistakes: [
      'Using \`<div>\` for everything instead of semantic elements',
      'Forgetting \`<meta name="viewport">\` for mobile',
      'Multiple \`<main>\` elements',
      'Missing or incorrect \`<title>\`',
      'Not closing tags properly',
    ],
    interviewQuestions: [
      'What is semantic HTML and why does it matter?',
      'Explain the difference between \`<section>\` and \`<article>\`',
      'What should always go in \`<head>\`?',
      'Why is the viewport meta tag important?',
    ],
    practiceQuestions: [
      'Create a blog homepage with proper semantic structure',
      'Explain why \`<div>\` should be a last resort',
      'Design HTML structure for a product page',
    ],
    relatedProblemSlugs: [],
    tags: ['html', 'semantics', 'structure', 'fundamentals'],
  },

  {
    slug: 'html-forms-and-input',
    title: 'Forms, Input Elements & Validation',
    category: 'Forms & Validation',
    difficulty: 'MEDIUM',
    summary: 'Master form elements, input types, validation, and accessibility for forms.',
    content: `## The \`<form>\` Element

\`\`\`html
<form action="/submit" method="POST" novalidate>
  <!-- Form controls go here -->
  <button type="submit">Submit</button>
</form>
\`\`\`

**Attributes:**
- \`action\` — URL to send form data to
- \`method\` — GET (visible in URL) or POST (hidden, secure)
- \`enctype\` — \`application/x-www-form-urlencoded\` (default), \`multipart/form-data\` (files)
- \`novalidate\` — Disable HTML5 validation (if you want custom)

## Input Types

\`\`\`html
<!-- Text inputs -->
<input type="text" name="firstName">
<input type="email" name="email">
<input type="password" name="password">
<input type="url" name="website">
<input type="tel" name="phone">
<input type="number" name="age" min="0" max="120">
<input type="date" name="birthDate">
<input type="time" name="meetTime">

<!-- Selections -->
<select name="country">
  <option value="">Choose...</option>
  <option value="us">USA</option>
  <option value="uk">UK</option>
</select>

<!-- Multiple selection -->
<textarea name="bio" rows="4" cols="50"></textarea>

<!-- Checkboxes & Radio -->
<input type="checkbox" name="agree" id="agree">
<label for="agree">I agree</label>

<input type="radio" name="size" value="small" id="small">
<label for="small">Small</label>

<!-- File upload -->
<input type="file" name="photo" accept="image/*">

<!-- Submit & Reset -->
<button type="submit">Submit</button>
<button type="reset">Clear</button>
\`\`\`

## HTML5 Validation

\`\`\`html
<form>
  <input type="email" required>
  <input type="text" minlength="5" maxlength="20">
  <input type="number" min="1" max="100">
  <input type="text" pattern="[A-Z]{3}" title="3 uppercase letters">
  <button type="submit">Submit</button>
</form>
\`\`\`

**Validation Attributes:**
- \`required\` — Must be filled
- \`minlength\` / \`maxlength\` — String length
- \`min\` / \`max\` — Number/date range
- \`pattern\` — Regex match
- \`type\` — Implicit validation (email, url, number, etc)

**Validation States:**
- \`:valid\` — Passes validation
- \`:invalid\` — Fails validation
- \`:required\` — Has \`required\` attribute
- \`:optional\` — No \`required\` attribute

\`\`\`css
input:invalid {
  border-color: red;
}
input:valid {
  border-color: green;
}
\`\`\`

## Accessibility

**Always use \`<label>\`:**
\`\`\`html
<!-- ❌ Bad: User must click precisely on checkbox -->
<input type="checkbox" id="newsletter">
Newsletter

<!-- ✓ Good: Larger click target -->
<input type="checkbox" id="newsletter">
<label for="newsletter">Newsletter</label>
\`\`\`

**Group related inputs:**
\`\`\`html
<fieldset>
  <legend>Shipping Address</legend>
  <input type="text" placeholder="Street">
  <input type="text" placeholder="City">
  <input type="text" placeholder="Zip">
</fieldset>
\`\`\`

**Error Messages:**
\`\`\`html
<input
  type="email"
  aria-describedby="email-error"
  required>
<span id="email-error" role="alert">
  Please enter a valid email
</span>
\`\`\`
`,
    contentHi: `## \`<form>\` Element

\`\`\`html
<form action="/submit" method="POST">
  <!-- Form controls -->
  <button type="submit">Submit</button>
</form>
\`\`\`

**Attributes:**
- \`action\` — Data kahin bhejni hai
- \`method\` — GET (URL mein visible) ya POST (secure)

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
\`\`\`

## HTML5 Validation

\`\`\`html
<input type="email" required>
<input type="text" minlength="5" maxlength="20">
<input type="number" min="1" max="100">
\`\`\`

## Accessibility

Hamesha \`<label>\` use karo:
\`\`\`html
<input type="checkbox" id="newsletter">
<label for="newsletter">Newsletter</label>
\`\`\`
`,
    simple: `Forms collect user input. Use \`<input>\` with appropriate types (email, password, number), always pair with \`<label>\`, and validate with HTML5 attributes like \`required\` and \`pattern\`.`,
    simpleHi: `Forms user se input lete hain. \`<input>\` use karo sahi type ke saath (email, password, number), \`<label>\` laga do, aur \`required\`, \`pattern\` se validate karo.`,
    tricks: `HTML5 validation is for UX, not security. Always validate on the server too. \`<label for="id">\` increases click target.`,
    tricksHi: `HTML5 validation sirf UX ke liye hai. Server par bhi validate karo. \`<label>\` click area badha deta hai.`,
    codeExample: `<form action="/signup" method="POST">
  <fieldset>
    <legend>Sign Up</legend>

    <label for="email">Email:</label>
    <input
      type="email"
      id="email"
      name="email"
      required
      aria-describedby="email-help">
    <small id="email-help">We'll never share your email</small>

    <label for="password">Password:</label>
    <input
      type="password"
      id="password"
      name="password"
      minlength="8"
      required>

    <label for="age">Age:</label>
    <input
      type="number"
      id="age"
      name="age"
      min="18"
      max="120">

    <label for="country">Country:</label>
    <select id="country" name="country" required>
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
    expectedOutput: `Accessible, validated form with proper labels and error messaging`,
    commonMistakes: [
      'Forgetting \`<label>\` elements',
      'Using \`placeholder\` instead of \`<label>\`',
      'Not validating on the server',
      'Using \`type="text"\` for everything',
      'Missing \`name\` attributes on inputs',
    ],
    interviewQuestions: [
      'What is the difference between GET and POST?',
      'Explain HTML5 form validation',
      'Why is \`<label>\` important for accessibility?',
      'What is the difference between \`<select>\` and \`<datalist>\`?',
    ],
    practiceQuestions: [
      'Build a login form with validation',
      'Create a multi-step form with fieldsets',
      'Implement custom form validation with error messages',
    ],
    relatedProblemSlugs: [],
    tags: ['html', 'forms', 'input', 'validation', 'accessibility'],
  },

  {
    slug: 'html-accessibility-a11y',
    title: 'Accessibility Fundamentals (a11y)',
    category: 'Accessibility (a11y)',
    difficulty: 'MEDIUM',
    summary: 'Make HTML accessible to all users including those with disabilities. ARIA, semantic markup, and best practices.',
    content: `## What is Accessibility (a11y)?

Accessibility means designing for all users:
- Blind/low vision (screen readers)
- Deaf/hard of hearing (captions)
- Motor disabilities (keyboard navigation)
- Cognitive disabilities (clear language)

**You don't need\`<div onclick>\` when \`<button>\` exists.**

## Semantic HTML is Accessible HTML

\`\`\`html
<!-- ❌ Not accessible: needs JS and ARIA to be a button -->
<div class="btn" onclick="handleClick()">Click me</div>

<!-- ✓ Accessible: built-in keyboard support, screen reader announces it as button -->
<button onclick="handleClick()">Click me</button>
\`\`\`

Semantic elements provide:
- Keyboard navigation
- Screen reader announcements
- Correct focus management
- No ARIA needed

## Keyboard Navigation

Users without a mouse navigate via Tab (next), Shift+Tab (prev), Enter (activate).

\`\`\`html
<!-- Interactive elements are focusable by default -->
<button>Click me</button>
<a href="/">Link</a>
<input type="text">
<select>
  <option>Option</option>
</select>

<!-- Non-interactive elements can be made focusable -->
<div tabindex="0">Focusable</div>

<!-- Remove from tab order but keep focusable -->
<div tabindex="-1">Not in tab order</div>

<!-- DO NOT overuse tabindex; use semantic elements -->
\`\`\`

## ARIA (Accessible Rich Internet Applications)

ARIA enhances semantic HTML but should not replace it.

**When to use ARIA:**
- Custom widgets (a custom dropdown)
- Live regions (updates without reload)
- Hidden content changes (what changed?)

\`\`\`html
<!-- Live region for chat messages -->
<div aria-live="polite" aria-label="Chat messages">
  <p>User just joined</p>
</div>

<!-- Describe an icon button -->
<button aria-label="Close menu">✕</button>

<!-- Indicate something is loading -->
<div aria-busy="true">Loading...</div>

<!-- Describe relationships -->
<label for="username">Username:</label>
<input id="username" aria-describedby="username-hint">
<span id="username-hint">3-20 characters, no spaces</span>
\`\`\`

## Images & Icons

\`\`\`html
<!-- ❌ Missing alt text: screen reader announces "image" -->
<img src="dog.jpg">

<!-- ✓ Descriptive alt text -->
<img src="dog.jpg" alt="Golden retriever playing fetch">

<!-- ❌ Redundant alt text -->
<img src="linkedin.svg" alt="LinkedIn logo">
<a href="linkedin.com">LinkedIn</a>

<!-- ✓ Empty alt for decorative images -->
<img src="divider.svg" alt="">

<!-- Icon that's a button -->
<button aria-label="Search">🔍</button>
\`\`\`

## Color & Contrast

**WCAG AA Standard:**
- Normal text: 4.5:1 contrast ratio
- Large text: 3:1 contrast ratio

\`\`\`css
/* ❌ Low contrast: text hard to read -->
.light-gray { color: #ccc; }

/* ✓ High contrast */
.dark-gray { color: #333; }
\`\`\`

## Text Alternatives

\`\`\`html
<!-- ❌ No transcript for video -->
<video src="demo.mp4"></video>

<!-- ✓ Captions for deaf users -->
<video controls>
  <source src="demo.mp4">
  <track kind="captions" src="demo.vtt">
</video>

<!-- ✓ Transcript for screen reader users -->
<details>
  <summary>Video Transcript</summary>
  <p>Speaker discusses X, Y, Z...</p>
</details>
\`\`\`

## Skip Links

\`\`\`html
<!-- Hidden link to jump past navigation -->
<a href="#main" class="skip-link">Skip to content</a>

<!-- CSS hides until focused -->
<style>
  .skip-link {
    position: absolute;
    left: -9999px;
  }
  .skip-link:focus {
    position: static;
  }
</style>

<nav>Navigation...</nav>
<main id="main">Content...</main>
\`\`\`

## Testing

- **Keyboard only:** Can you navigate everything with Tab?
- **Screen reader:** Use NVDA (Windows) or VoiceOver (Mac)
- **Color contrast:** Use WebAIM Contrast Checker
- **Automated:** axe, Lighthouse
`,
    contentHi: `## Accessibility kya hai?

Sabke liye design karo:
- Blind log (screen readers)
- Deaf log (captions)
- Motor disability (keyboard)
- Cognitive issues (clear language)

## Semantic HTML = Accessible HTML

\`\`\`html
<!-- ❌ Accessible nahi -->
<div class="btn" onclick="click()">Click</div>

<!-- ✓ Accessible -->
<button>Click</button>
\`\`\`

\`<button>\` ko:
- Keyboard support built-in
- Screen reader announce karta hai
- No ARIA needed

## ARIA

Custom widgets ke liye ARIA use karo:

\`\`\`html
<!-- Live region -->
<div aria-live="polite">New message</div>

<!-- Button description -->
<button aria-label="Close">✕</button>

<!-- Input description -->
<input aria-describedby="help-text">
<span id="help-text">3-20 characters</span>
\`\`\`

## Images

\`\`\`html
<!-- ✓ Descriptive alt text -->
<img src="dog.jpg" alt="Golden retriever playing">

<!-- ✓ Empty alt for decorative images -->
<img src="divider.svg" alt="">

<!-- Button icon -->
<button aria-label="Search">🔍</button>
\`\`\`

## Color Contrast

Normal text: 4.5:1 minimum ratio
\`\`\`css
color: #333;  /* Good contrast -->
\`\`\`
`,
    simple: `Accessible websites work for everyone: keyboard navigation, screen readers, high contrast, proper labels. Start with semantic HTML (\`<button>\`, \`<label>\`, \`<main>\`), add alt text to images, ensure color contrast, and test with a screen reader.`,
    simpleHi: `Accessible websites sabke liye kaam kare: keyboard, screen readers, contrast, labels. Semantic HTML se shuru karo, images ko alt text do, aur screen reader se test karo.`,
    tricks: `Use semantic elements first. ARIA is a last resort. Empty \`alt=""\` for decorative images. Always keyboard-test.`,
    tricksHi: `Semantic elements use karo pehle. ARIA last resort hai. Decorative images ke liye \`alt=""\` use karo.`,
    codeExample: `<html lang="en">
<head>
  <title>Accessible Blog</title>
</head>
<body>
  <a href="#main" class="skip-link">Skip to content</a>

  <header>
    <h1>My Blog</h1>
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
    </nav>
  </header>

  <main id="main">
    <article>
      <h2>Article Title</h2>
      <img
        src="hero.jpg"
        alt="Mountain landscape at sunset">
      <p>Content...</p>
    </article>
  </main>

  <footer>
    <p>© 2024</p>
  </footer>
</body>
</html>`,
    expectedOutput: `Accessible website navigable by keyboard and screen readers`,
    commonMistakes: [
      'Missing alt text on images',
      'Low contrast text and background',
      'Using \`<div>\` instead of \`<button>\`',
      'Not testing with keyboard or screen reader',
      'Overusing ARIA when semantic HTML would work',
    ],
    interviewQuestions: [
      'What does "a11y" stand for and what does it mean?',
      'Explain the difference between alt text and title attribute',
      'When should you use ARIA over semantic HTML?',
      'How do you make an icon button accessible?',
    ],
    practiceQuestions: [
      'Audit a website for accessibility issues',
      'Add a11y improvements to an existing page',
      'Test a website with a screen reader',
    ],
    relatedProblemSlugs: [],
    tags: ['html', 'accessibility', 'aria', 'wcag', 'semantics'],
  },
];
