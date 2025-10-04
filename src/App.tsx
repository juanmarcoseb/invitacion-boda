import { Outlet } from "react-router-dom"

export default function App() {
  return (
    // No pongas fondo aquí; dejamos que el <body> muestre la imagen
    <div className="min-h-screen">
      <main className="min-h-screen flex items-center justify-center py-8 md:py-12">
        <Outlet />
      </main>
    </div>
  )
}
