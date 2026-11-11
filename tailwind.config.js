/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: { colors: { brand: { 50:'#eef4ff', 100:'#d6e6ff', 500:'#2b7bf7', 600:'#0067f4', 700:'#0049b8', 900:'#021245' } }, boxShadow: { soft:'0 12px 40px rgba(15, 45, 75, .07)' } } },
  plugins: [],
}
