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
          primary: '#10b981', // Emerald 500
          hover: '#059669', // Emerald 600
          dark: '#020403', // Deep Black/Green
          surface: '#0f1614', // Dark Card Bg
          border: '#1f2e2a', // Subtle Border
          text: '#ecfdf5', // Light Text
          input: '#111a16',
        }
      }
    },
  },
  plugins: [],
}
