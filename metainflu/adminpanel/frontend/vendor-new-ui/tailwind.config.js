/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { 500: '#ec4899', 600: '#db2777', 700: '#be185d' },
        neutral: { 50:'#fafafa',100:'#f5f5f5',200:'#e5e5e5',300:'#d4d4d4',400:'#a3a3a3',500:'#737373',600:'#525252',700:'#404040',800:'#262626',900:'#171717' },
        success: '#10b981', warning: '#f59e0b', danger: '#ef4444', info: '#3b82f6'
      },
      fontFamily: { sans: ['Inter','system-ui','sans-serif'], display: ['Poppins','system-ui','sans-serif'] },
      boxShadow: { soft: '0 2px 15px -3px rgba(0,0,0,0.07),0 10px 20px -2px rgba(0,0,0,0.04)' }
    }
  },
  plugins: [],
}
