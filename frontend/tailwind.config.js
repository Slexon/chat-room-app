/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // Scannt alle JS/JSX-Dateien in src/
  ],
  theme: {
    extend: {
      // Optionale Erweiterungen: Füge hier custom Farben oder Fonts hinzu, z. B.
      // colors: { 'custom-blue': '#1d4ed8' },
    },
  },
  plugins: [],
};
