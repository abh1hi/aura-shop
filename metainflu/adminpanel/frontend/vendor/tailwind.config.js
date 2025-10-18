/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Core Palette (inspired by iOS/Dribbble shot)
        'primary-blue': '#007AFF', // Main actionable blue
        'secondary-blue': '#E9F5FF', // Lighter blue for backgrounds/highlights
        'gray-bg': '#F8F9FA', // Lightest background
        'gray-surface': '#FFFFFF', // Card/surface background
        'gray-text': '#6C757D', // Secondary text
        'gray-dark-text': '#212529', // Primary text
        'gray-border': '#E0E0E0', // Light borders
        'success-green': '#28A745', // For "Completed" tasks
        'info-purple': '#6F42C1', // For "In Progress" or other info
        'warning-orange': '#FD7E14', // For "Pending" status
        'danger-red': '#DC3545', // For alerts/errors
        'chart-blue': '#7B61FF', // For the line chart (Budget vs Actual)
        'chart-green': '#A7ED86', // Another chart color
        'chart-light-blue': '#84E0FF', // Bar chart color
        'chart-light-purple': '#D9D0FF', // Bar chart color
        'chart-light-green': '#DCFCE7', // Card highlight color
      },
      fontFamily: {
        // Use Inter as a default clean sans-serif font
        sans: ['Inter var', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
      },
      borderRadius: {
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '32px',
      },
      boxShadow: {
        'soft': '0 4px 12px rgba(0, 0, 0, 0.05)',
        'md': '0 6px 16px rgba(0, 0, 0, 0.08)',
        'lg': '0 8px 20px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};
