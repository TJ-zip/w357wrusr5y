/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        resqGreen: "#12855f",
        resqGreenDark: "#0a3d2e",
        resqGreenMuted: "#5a7368",
        resqGreenSoft: "#e8f3ee",
        resqLine: "#c9dad2",
        resqRed: "#c8322a",
        resqRedDark: "#a82a23",
        resqRedSoft: "#fff3f1",
      },
    },
  },
  plugins: [],
};
