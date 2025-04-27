/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}" ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#fff",
        main: "#FF69B4",
        black: {
          DEFAULT: "#000",
          100: "#1E1E2D",
          200: "#232533",
        },
        gray: {
          100: "#CDCDE0",
          200: "#303030",
          300: "#909090"
        },
      },
      fontFamily: {
        pbold: ["SF-Bold", "sans-serif"],
        psemibold: ["SF-Semi-Bold", "sans-serif"],
        pmedium: ["SF-Medium", "sans-serif"]
      },
    },
  },
  plugins: [],
}