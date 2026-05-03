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
        secondary: "#0EA5E9",
        accent: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
        background: "#F8FAFC",
        border: "#E2E8F0",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 10px -1px rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
}
