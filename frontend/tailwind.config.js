/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    // Make sure this line is correct for your project structure
    // If your project is inside 'devi dhaam' folder, it should reflect that
    "./src/**/*.{vue,js,ts,jsx,tsx}", // Yeh line sahi honi chahiye
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
        xl: '3rem',
      },
    },
    extend: {
      colors: {
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          300: '#fdba74',
          500: '#fb923c',
          600: '#f97316',
          700: '#c2410c'
        },
        muted: '#6b7280'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial'],
        heading: ['"Playfair Display"', 'serif'],
      },
      boxShadow: {
        'soft-lg': '0 10px 30px rgba(2,6,23,0.12)',
        'elevate': '0 6px 18px rgba(15,23,42,0.08)'
      },
      borderRadius: {
        'xl': '1rem'
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding'
      }
    },
  },
  plugins: [],
}