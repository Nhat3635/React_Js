/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a1a1a',
        secondary: '#F9FAFB',
        textMuted: '#6b7280',
        brandOrange: '#f97316', 
        brandLight: '#fff7ed',  
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.03)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.05)',
      }
    },
  },
  plugins: [],
}
