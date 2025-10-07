import { Outlet } from "react-router-dom"

export default function App() {
  return (
    /* Dejamos el fondo en <body> y centramos el contenido verticalmente
       con un contenedor que respeta safe areas en móvil */
    <div className="min-h-screen">
      <main
        className="min-h-screen flex items-start md:items-center justify-center"
        style={{
          paddingTop: "max(env(safe-area-inset-top), 16px)",
          paddingBottom: "max(env(safe-area-inset-bottom), 16px)",
        }}
      >
        <Outlet />
      </main>
    </div>
  )
}
