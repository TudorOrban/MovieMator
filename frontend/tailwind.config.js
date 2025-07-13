// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Make sure your Angular component files are included here
    // For example:
    './src/**/*.{html,ts}',
    './projects/**/*.{html,ts}', // If you have a multi-project Angular workspace
  ],
  theme: {
    extend: {
      spacing: {
        '3.4': '13.6px', // This is the custom value for w-3.4 and h-3.4
        // You can add other custom values here if needed, e.g.,
        // '0.5': '2px', // If you wanted a custom mr-0.5
      },
      // Other extensions like colors, fonts, etc. would go here
    },
    // Default Tailwind theme values can be overridden directly here
  },
  plugins: [
    // Your Tailwind plugins go here
  ],
}