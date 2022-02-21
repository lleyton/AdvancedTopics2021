module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        inndigo: "#1e6feb",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
