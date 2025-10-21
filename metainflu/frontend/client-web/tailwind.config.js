/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '475px',     // Extra small devices
      'sm': '640px',     // Mobile landscape / Small tablets
      'md': '768px',     // Tablets
      'lg': '1024px',    // Laptops / Small desktops
      'xl': '1280px',    // Large desktops
      '2xl': '1536px',   // Extra large desktops
      // Custom breakpoints for specific use cases
      'mobile': {'max': '767px'}, // Mobile-first queries
      'tablet': {'min': '768px', 'max': '1023px'}, // Tablet-specific
      'desktop': {'min': '1024px'}, // Desktop and above
    },
    extend: {
      colors: {
        'primary': {
          50: '#f8f9fa',
          100: '#f1f3f4',
          500: '#1a1a1a', // Main primary
          600: '#0d1117',
          900: '#000000',
        },
        'secondary': {
          50: '#ffffff',
          100: '#f8fafc',
          500: '#64748b',
          600: '#475569',
          900: '#0f172a',
        },
        'accent': {
          50: '#fef7ed',
          100: '#fdedd3',
          500: '#c5a47e', // Main accent (Muted Gold)
          600: '#b8976f',
          900: '#8b6914',
        },
        'neutral': {
          50: '#fafafa',
          100: '#f5f5f5',
          500: '#737373',
          600: '#525252',
          900: '#171717',
        },
        'surface': {
          50: '#ffffff',
          100: '#f8fafc',
          200: '#f1f5f9',
          300: '#e2e8f0',
        },
        'border': {
          light: '#e2e8f0',
          DEFAULT: '#cbd5e1',
          dark: '#475569',
        }
      },
      fontFamily: {
        'serif': ['"Playfair Display"', 'serif'],
        'sans': ['Inter', '"Lato"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-subtle': 'bounceSubtle 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
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
        bounceSubtle: {
          '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0,0,0)' },
          '40%, 43%': { transform: 'translate3d(0, -5px, 0)' },
          '70%': { transform: 'translate3d(0, -3px, 0)' },
          '90%': { transform: 'translate3d(0, -1px, 0)' },
        },
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'large': '0 10px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [
    // Custom plugin for touch-friendly interactions
    function({ addUtilities }) {
      addUtilities({
        '.touch-manipulation': {
          'touch-action': 'manipulation',
        },
        '.touch-pan-x': {
          'touch-action': 'pan-x',
        },
        '.touch-pan-y': {
          'touch-action': 'pan-y',
        },
        '.touch-none': {
          'touch-action': 'none',
        },
        // Safe area insets for mobile devices
        '.safe-top': {
          'padding-top': 'env(safe-area-inset-top)',
        },
        '.safe-bottom': {
          'padding-bottom': 'env(safe-area-inset-bottom)',
        },
        '.safe-left': {
          'padding-left': 'env(safe-area-inset-left)',
        },
        '.safe-right': {
          'padding-right': 'env(safe-area-inset-right)',
        },
      });
    }
  ],
};