/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        rainbow:
          "linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)",
        gradient:
          "linear-gradient(135deg, #FFDDC1 0%, #FFC1C1 20%, #FFD1DC 40%, #C1E1C1 60%, #C1E1FF 80%, #D1C1FF 100%)",
      },
    },
  },
  plugins: [],
};
