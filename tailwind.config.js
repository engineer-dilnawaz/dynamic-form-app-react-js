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
        brand: {
          primary: '#2BEE79', // Primary Green
          hover: '#24D66C', // Primary Hover
          light: '#80F5AD', // Primary Light
          dark: '#132217', // BG Dark
          surface: '#1A2C22', // Surface
          border: '#2B392F', // Border
          text: '#FFFFFF', // Text Main
          muted: '#9DB9A8', // Text Muted
          input: '#1A2C22', // Match Surface
        }
      }
    },
  },
  plugins: [],
}
