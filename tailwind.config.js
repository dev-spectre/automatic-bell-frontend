/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        navy: {
          500: "#1E2137",
          600: "#161B2F",
          800: "#071E28",
        },
        dark: {
          blue: {
            300: "#02091D",
          },
        },
        orange: {
          450: "#E68133",
        },
      },
      gradientColorStops: {
        5: "5%",
        1: "1%",
      },
    },
  },
  plugins: [],
};
