/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        iosBg: '#F2F2F7',
        iosCard: '#FFFFFF',
        iosText: '#1C1C1E',
        iosMuted: '#8E8E93',
        iosBlue: '#0A84FF',
        iosRed: '#FF3B30',
        iosGreen: '#34C759',
        iosYellow: '#FFCC00'
      },
      borderRadius: {
        xl: '14px'
      },
      boxShadow: {
        ios: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)'
      }
    }
  },
  plugins: []
}
