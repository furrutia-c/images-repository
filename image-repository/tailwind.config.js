/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Configuramos el modo oscuro para que use la clase "dark" en vez de media queries
  darkMode: 'class',
  theme: {
    extend: {
      // Podemos extender los colores si lo necesitamos
    },
  },
  plugins: [],
}