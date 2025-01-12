/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dodgerblue: {
          "100": "#1572d3",
          "200": "rgba(21, 114, 211, 0.1)",
        },
      },
    },
  },
};