/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}',
    './projects/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      spacing: {
        '3.4': '13.6px',
      },
    },
  },
  plugins: [],
}