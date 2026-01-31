/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0f0f0f",
        surface: "#181818",
        border: "#262626",
        gold: "#d4af37"
      }
    }
  },
  plugins: []
};
