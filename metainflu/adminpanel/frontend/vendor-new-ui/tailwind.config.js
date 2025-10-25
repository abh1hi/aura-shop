/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#0b0b0b'
        },
        blue: {
          500: '#2563eb',
          600: '#1d4ed8'
        },
        gray: {
          50:'#fafafa',100:'#f5f5f5',200:'#e5e7eb',300:'#d1d5db',400:'#9ca3af',500:'#6b7280',600:'#4b5563',700:'#374151',800:'#1f2937',900:'#111827'
        },
        green: {
          100: '#dcfce7',
          500: '#22c55e'
        }
      },
      borderRadius: { xl: '0.75rem', '2xl': '1rem' },
      boxShadow: { soft: '0 1px 0 rgba(0,0,0,0.04)', card: '0 1px 2px rgba(0,0,0,0.04), 0 1px 1px rgba(0,0,0,0.03)' }
    }
  },
  plugins: [],
}
