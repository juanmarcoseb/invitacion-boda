import { Link } from "react-router-dom"

export default function Home() {
  return (
    <section className="wrapper w-full min-h-[100svh] flex items-center justify-center py-10">
      <div className="card w-full max-w-[880px] p-6 md:p-10 text-center space-y-6 md:space-y-8">
        <header className="space-y-2">
          <h1 className="font-heading text-[44px] leading-none md:text-[64px] text-[var(--brand-primary)]">
            Marcos & Naty
          </h1>
          <div className="ornament my-2">
            <span className="dot" aria-hidden="true"></span>
          </div>
          <p className="font-body text-base md:text-lg muted">
            ¡Bienvenidos a nuestra invitación! Aquí encontrarás toda la información
            importante y podrás confirmar tu asistencia.
          </p>
        </header>

        <div className="grid gap-3 md:gap-4 md:grid-cols-3 text-left">
          <div className="rounded-xl border bg-white/90 p-4">
            <p className="text-sm tracking-wide muted">Fecha</p>
            <p className="font-heading text-2xl text-[var(--brand-primary)]">12 • 12 • 2025</p>
          </div>
          <div className="rounded-xl border bg-white/90 p-4">
            <p className="text-sm tracking-wide muted">Ceremonia</p>
            <p className="font-heading text-2xl text-[var(--brand-primary)]">Iglesia Santa María</p>
          </div>
          <div className="rounded-xl border bg-white/90 p-4">
            <p className="text-sm tracking-wide muted">Recepción</p>
            <p className="font-heading text-2xl text-[var(--brand-primary)]">Hacienda El Encanto</p>
          </div>
        </div>

        <div className="actions-group">
          <Link to="/rsvp" className="btn-primary">
            Ir a confirmar (RSVP)
          </Link>
        </div>
      </div>
    </section>
  )
}
