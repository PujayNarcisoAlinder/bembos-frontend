/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bembos-blue': '#0000A0',     // Azul oscuro del header
        'bembos-yellow': '#FFC107',   // Amarillo de botones
        'bembos-cream': '#FFF8E7',    // Fondo crema
        'bembos-black': '#1A1A1A',    // Negro de la barra inferior
        'bembos-red': '#C1272D',
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}