/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // The core "Asset Defense" Palette
        background: "#050505",       // Deepest Black
        surface: "#121212",          // Slightly lighter for cards
        primary: "#a67cff",          // Your Brand Purple
        secondary: "#6366f1",        // Indigo for gradients
        textMain: "#EDEDED",         // White-ish text
        textMuted: "#A1A1AA",        // Gray text
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}