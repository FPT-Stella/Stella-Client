/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/layouts/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
      },
      keyframes: {
        zoom: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.1)" },
        },
        typing: {
          "0%": { width: "0" },
          "70%": { width: "100%" },
          "90%": { width: "100%" },
          "100%": { width: "0" },
        },
        blink: {
          "0%, 100%": { borderColor: "transparent" },
          "50%": { borderColor: "#000" },
        },
      },
      animation: {
        zoom: "zoom 1.5s ease-in-out infinite alternate",
        typing: "typing 6s steps(30, end) infinite",
        blink: "blink 0.7s step-end infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

