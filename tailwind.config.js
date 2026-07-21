/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          950: "#0a0b0f",
          900: "#111319",
          850: "#161923",
          800: "#1b1f2b",
          700: "#252a3a",
          600: "#343b52",
          border: "#2a3040"
        },
        accent: {
          500: "#22c55e",
          600: "#16a34a",
          400: "#4ade80"
        },
        brand: {
          500: "#6366f1",
          600: "#4f46e5",
          400: "#818cf8"
        }
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.03)"
      },
      borderRadius: {
        xl2: "1rem"
      }
    }
  },
  plugins: []
};
