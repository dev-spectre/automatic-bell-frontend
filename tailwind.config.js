/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      backgroundColor: {
        navy: {
          500: "#1E2137",
          800: "#071E28",
        },
        orange: {
          450: "#E68133",
        },
      },
    },
  },
  plugins: [],
};
