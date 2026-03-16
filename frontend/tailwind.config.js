/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gurukulBlue: "#0B1D3A",
        saffron: "#F59E0B"
      }
    },
  },
  plugins: [],
}