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
        'navy': '#001f3f',
        'deep-navy': '#000d1a',
        'indigo': '#4338ca',
        'violet': '#7c3aed',
        'cyan': '#06b6d4',
        'teal': '#14b8a6',
        'purple': '#a855f7',
      },
    },
  },
  plugins: [],
}
