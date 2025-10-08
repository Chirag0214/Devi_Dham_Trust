/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    // Make sure this line is correct for your project structure
    // If your project is inside 'devi dhaam' folder, it should reflect that
    "./src/**/*.{vue,js,ts,jsx,tsx}", // Yeh line sahi honi chahiye
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}