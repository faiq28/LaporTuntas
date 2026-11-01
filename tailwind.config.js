/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: { colors: { brand: { 50:'#eef8ff', 100:'#d9efff', 500:'#1687d9', 600:'#0874c4', 700:'#075b99', 900:'#103b5b' } }, boxShadow: { soft:'0 12px 40px rgba(15, 45, 75, .07)' } } },
  plugins: [],
}
