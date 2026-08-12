/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm, calm palette drawn from the portraits and the certificates
        cream: "#faf6f0",
        sand: "#f3ebe0",
        clay: {
          50: "#f7efe9",
          100: "#ecdccf",
          200: "#d9bda6",
          300: "#c69e7f",
          400: "#b3855f",
          500: "#5e3c2d", // primary accent
          600: "#8a5c49",
          700: "#6f4a3b",
        },
        rose: {
          100: "#f6e7e4",
          200: "#e7c9c3",
          300: "#d9b8b0",
        },
        ink: {
          DEFAULT: "#3a3532",
          soft: "#6b625c",
          faint: "#948b83",
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ['"Manrope"', "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "72rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out both",
        "fade-in": "fade-in 0.4s ease-out both",
      },
    },
  },
  plugins: [],
}
