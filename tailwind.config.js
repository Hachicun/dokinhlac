/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      width: {
        '6': '1.5rem', // Add custom width if needed
      },
      height: {
        '6': '1.5rem', // Add custom height if needed
      },
    },
  },
  plugins: [],
}
