/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Instrument Serif"', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
        },
        accent: {
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.35s ease both',
        'slide-up': 'slideUp 0.35s ease both',
        'thinking': 'thinking 1.2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        thinking: { '0%,100%': { transform: 'scale(1)', opacity: 1 }, '50%': { transform: 'scale(1.4)', opacity: 0.6 } },
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        noteforge: {
          primary: '#2563eb',
          'primary-content': '#ffffff',
          secondary: '#7c3aed',
          'secondary-content': '#ffffff',
          accent: '#10b981',
          neutral: '#18181b',
          'base-100': '#fafafa',
          'base-200': '#f4f4f5',
          'base-300': '#e4e4e7',
          'base-content': '#18181b',
          info: '#3b82f6',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
        },
      },
    ],
  },
}
