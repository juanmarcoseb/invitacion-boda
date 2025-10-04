import { Outlet } from "react-router-dom"

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sin header/nav para no exponer otras rutas */}
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Outlet />
      </main>
    </div>
  )
}
