// src/App.tsx
import { Outlet, NavLink } from "react-router-dom"

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header mínimo (lo iremos diseñando luego) */}
      <header className="border-b bg-white/70 backdrop-blur sticky top-0">
        <nav className="mx-auto max-w-3xl px-4 py-3 flex gap-4">
          <NavLink to="/" className="font-semibold">Inicio</NavLink>
          <NavLink to="/rsvp" className="font-semibold">RSVP</NavLink>
          {/* Más enlaces luego (detalles, RSVP, galería...) */}
        </nav>
      </header>

      {/* Contenido */}
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Outlet />
      </main>
    </div>
  )
}
