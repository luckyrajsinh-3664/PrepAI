/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        darkBg: '#0b0f19',
        darkCard: 'rgba(17, 24, 39, 0.75)',
        accentCyan: '#06b6d4',
        accentViolet: '#8b5cf6',
        accentPink: '#ec4899',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}