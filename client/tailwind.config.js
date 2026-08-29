/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Semantic tokens — components never hardcode a palette shade, so the
        // whole app re-themes by editing this block.
        surface: {
          DEFAULT: 'rgb(var(--surface) / <alpha-value>)',
          raised: 'rgb(var(--surface-raised) / <alpha-value>)',
          sunken: 'rgb(var(--surface-sunken) / <alpha-value>)',
        },
        line: 'rgb(var(--line) / <alpha-value>)',
        content: {
          DEFAULT: 'rgb(var(--content) / <alpha-value>)',
          muted: 'rgb(var(--content-muted) / <alpha-value>)',
          subtle: 'rgb(var(--content-subtle) / <alpha-value>)',
        },
        brand: {
          DEFAULT: 'rgb(var(--brand) / <alpha-value>)',
          soft: 'rgb(var(--brand-soft) / <alpha-value>)',
        },
        /* Data only — charts, live values, visualiser highlights. Never actions. */
        accent: 'rgb(var(--accent) / <alpha-value>)',
        easy: 'rgb(var(--easy) / <alpha-value>)',
        medium: 'rgb(var(--medium) / <alpha-value>)',
        hard: 'rgb(var(--hard) / <alpha-value>)',
      },
      fontFamily: {
        // Display is used sparingly — page titles and the logo, nothing else.
        display: ['Bricolage Grotesque', 'Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Geist', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'sans-serif'],
        mono: ['Geist Mono', 'ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'none' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.97)' },
          to: { opacity: '1', transform: 'none' },
        },
        // Irregular on purpose — an evenly pulsing flame reads as a loading dot.
        flicker: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
          '25%': { transform: 'scale(1.12) rotate(-3deg)' },
          '50%': { transform: 'scale(0.96) rotate(2deg)' },
          '75%': { transform: 'scale(1.08) rotate(-1deg)' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '60%': { transform: 'scale(1.04)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        // Route change: opacity plus a small lift. Anything larger reads as the
        // app being slow rather than the app being polished.
        'page-in': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'none' },
        },
      },
      animation: {
        'fade-up': 'fade-up 180ms ease-out',
        'scale-in': 'scale-in 140ms ease-out',
        flicker: 'flicker 2.4s ease-in-out infinite',
        'pop-in': 'pop-in 320ms cubic-bezier(0.22, 1, 0.36, 1)',
        'page-in': 'page-in 220ms cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionTimingFunction: {
        // One shared ease so every transition in the app feels related.
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
