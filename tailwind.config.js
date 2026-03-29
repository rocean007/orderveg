/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Semantic color tokens (UI/UX Pro Max - color-semantic rule)
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e', // Main brand green
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        surface: {
          light: '#ffffff',
          'light-elevated': '#f9fafb',
          dark: '#0f172a',
          'dark-elevated': '#1e293b',
        },
        'on-surface': {
          light: '#0f172a',
          'light-secondary': '#475569',
          dark: '#f8fafc',
          'dark-secondary': '#cbd5e1',
        },
        error: {
          light: '#ef4444',
          dark: '#f87171',
        },
        success: {
          light: '#22c55e',
          dark: '#4ade80',
        },
      },
      fontFamily: {
        // Typography pairing: Inter (headings) + Source Sans Pro (body)
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        body: ['var(--font-source-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Consistent type scale (UI/UX Pro Max - font-scale rule)
        'xs': ['0.75rem', { lineHeight: '1.5' }],      // 12px
        'sm': ['0.875rem', { lineHeight: '1.5' }],     // 14px
        'base': ['1rem', { lineHeight: '1.75' }],      // 16px - readable-font-size
        'lg': ['1.125rem', { lineHeight: '1.75' }],    // 18px
        'xl': ['1.25rem', { lineHeight: '1.5' }],      // 20px
        '2xl': ['1.5rem', { lineHeight: '1.4' }],      // 24px
        '3xl': ['1.875rem', { lineHeight: '1.3' }],    // 30px
        '4xl': ['2.25rem', { lineHeight: '1.2' }],     // 36px
        '5xl': ['3rem', { lineHeight: '1.1' }],        // 48px
      },
      spacing: {
        // 4pt/8dp spacing system (UI/UX Pro Max - spacing-scale rule)
        '0': '0px',
        '1': '0.25rem',    // 4px
        '2': '0.5rem',     // 8px
        '3': '0.75rem',    // 12px
        '4': '1rem',       // 16px
        '5': '1.25rem',    // 20px
        '6': '1.5rem',     // 24px
        '8': '2rem',       // 32px
        '10': '2.5rem',    // 40px
        '12': '3rem',      // 48px
        '16': '4rem',      // 64px
        '20': '5rem',      // 80px
        '24': '6rem',      // 96px
      },
      borderRadius: {
        'none': '0',
        'sm': '0.25rem',   // 4px
        'DEFAULT': '0.5rem',   // 8px
        'md': '0.75rem',   // 12px
        'lg': '1rem',      // 16px
        'xl': '1.5rem',    // 24px
        'full': '9999px',
      },
      boxShadow: {
        // Elevation system (UI/UX Pro Max - elevation-consistent rule)
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'DEFAULT': '0 2px 8px 0 rgb(0 0 0 / 0.06)',
        'md': '0 4px 12px 0 rgb(0 0 0 / 0.08)',
        'lg': '0 8px 24px 0 rgb(0 0 0 / 0.10)',
        'xl': '0 16px 48px 0 rgb(0 0 0 / 0.12)',
      },
      animation: {
        // Animation timing (UI/UX Pro Max - duration-timing rule)
        'fade-in': 'fadeIn 200ms ease-out',
        'fade-out': 'fadeOut 150ms ease-in',
        'slide-up': 'slideUp 250ms ease-out',
        'slide-down': 'slideDown 250ms ease-out',
        'scale-in': 'scaleIn 200ms ease-out',
        'skeleton': 'skeleton 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        skeleton: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      transitionDuration: {
        // Standard durations (UI/UX Pro Max - duration-timing rule)
        '150': '150ms',
        '200': '200ms',
        '250': '250ms',
        '300': '300ms',
      },
      transitionTimingFunction: {
        // Easing functions (UI/UX Pro Max - easing rule)
        'out': 'cubic-bezier(0.33, 1, 0.68, 1)',
        'in': 'cubic-bezier(0.32, 0, 0.67, 0)',
        'in-out': 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      screens: {
        // Breakpoint consistency (UI/UX Pro Max - breakpoint-consistency rule)
        'xs': '375px',     // Small phone
        'sm': '640px',     // Large phone
        'md': '768px',     // Tablet
        'lg': '1024px',    // Desktop
        'xl': '1280px',    // Large desktop
        '2xl': '1536px',   // Extra large
      },
      maxWidth: {
        // Container width (UI/UX Pro Max - container-width rule)
        'container': '1280px',
      },
      zIndex: {
        // Z-index management (UI/UX Pro Max - z-index-management rule)
        '0': '0',
        '10': '10',
        '20': '20',
        '30': '30',
        '40': '40',
        '50': '50',
        'dropdown': '100',
        'modal': '1000',
        'toast': '2000',
      },
    },
  },
  plugins: [],
}
