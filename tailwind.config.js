/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0F172A",
        secondary: "#059669",
        accent: "#F59E0B",
        warning: "#F59E0B",
        danger: "#EF4444",
        background: "#F8FAFC",
        border: "#E2E8F0",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '20px',
        '3xl': '32px',
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0,0,0,0.07)',
      }
    },
  },
  plugins: [],
}
