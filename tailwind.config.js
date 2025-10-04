/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#334e36",   // verde principal
          primary2: "#394f34",  // verde extra
          sand: "#f7e8c3",      // fondo cálido
          gold: "#c19937",      // acento dorado
          gold2: "#dec989",     // acento suave
        },
      },
      fontFamily: {
        heading: ['"The Seasons"', 'Cormorant Garamond', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        // Si luego auto-hospedas: 'Symphony' y 'The Seasons' aquí.
      },
      boxShadow: {
        soft: "0 8px 30px rgba(0,0,0,0.06)",
      },
      borderRadius: {
        xl2: "1rem",
      },
    },
  },
  plugins: [],
}
