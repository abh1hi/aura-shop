/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Inter', 'Roboto', 'Helvetica', 'Arial', 'sans-serif']
      },
      colors: {
        ios: {
          bg: '#F2F2F7',
          surface: '#FFFFFF',
          separator: 'rgba(60,60,67,0.29)',
          primary: '#0A84FF',
          success: '#34C759',
          warning: '#FF9F0A',
          danger: '#FF453A',
          indigo: '#5856D6',
          text: '#1C1C1E',
          secondary: '#3A3A3C',
          tertiary: '#8E8E93'
        }
      },
      borderRadius: {
        lg: '14px',
        md: '12px',
        sm: '10px'
      },
      boxShadow: {
        card: '0 0.5px 0 rgba(60,60,67,0.1), 0 1px 1px rgba(0,0,0,0.04)'
      },
      transitionDuration: {
        180: '180ms'
      }
    }
  },
  plugins: []
};
