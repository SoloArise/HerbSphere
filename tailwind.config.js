/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        herb: {
          50: "#f2fbf4",
          100: "#def7e5",
          500: "#2f9e62",
          600: "#247f4e",
          700: "#206640",
          900: "#173d2b",
        },
        sage: "#8aa399",
        pollen: "#f4c95d",
      },
      boxShadow: {
        soft: "0 18px 50px rgba(23, 61, 43, 0.12)",
      },
    },
  },
  plugins: [],
};
