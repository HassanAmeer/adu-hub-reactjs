/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        "secondary-hover": "var(--color-secondary-hover)",
        accent: "var(--color-accent)",
        warning: "var(--color-accent)",
        danger: "var(--color-danger)",
        background: "var(--color-bg)",
        border: "var(--color-border)",
        card: "var(--color-card)",
        muted: "var(--color-muted)",
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
