// ============================================================
// tailwind.config.js — Extends default Tailwind with custom
//                      keyframes and animation utilities
// ============================================================

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "cell-reveal": {
          "0%":   { opacity: "1", transform: "scale(1.25)" },
          "100%": { opacity: "0", transform: "scale(1)" },
        },
        explode: {
          "0%":   { transform: "scale(1)", filter: "brightness(1)" },
          "30%":  { transform: "scale(1.4)", filter: "brightness(2.5)" },
          "60%":  { transform: "scale(0.9)", filter: "brightness(1.5)" },
          "100%": { transform: "scale(1)", filter: "brightness(1)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(24px) scale(0.96)" },
          to:   { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        "cell-reveal": "cell-reveal 0.35s ease-out forwards",
        explode:        "explode 0.5s ease-out forwards",
        "fade-in":      "fade-in 0.3s ease-out forwards",
        "slide-up":     "slide-up 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards",
      },
    },
  },
  plugins: [],
};
