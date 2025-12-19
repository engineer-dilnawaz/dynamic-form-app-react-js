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
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        formbuilder: {
          "primary": "#2BEE79",
          "secondary": "#1A2C22",
          "accent": "#80F5AD",
          "neutral": "#2B392F",
          "base-100": "#132217",
          "base-200": "#1A2C22",
          "base-300": "#0f1614",
          "base-content": "#FFFFFF",
          "info": "#3abff8",
          "success": "#2BEE79",
          "warning": "#fbbd23",
          "error": "#f87272",
        },
      },
    ],
  },
}
