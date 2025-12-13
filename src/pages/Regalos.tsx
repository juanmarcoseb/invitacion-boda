import { Link } from "react-router-dom"

export default function Regalos() {
  return (
    <section className="wrapper w-full min-h-[100svh] flex items-center justify-center py-8">
      <div className="card overflow-hidden w-full p-5 md:p-8 lg:p-10 space-y-6 md:space-y-7">
        
        

        {/* Header */}
        <header className="text-center">
          <h1 className="font-heading text-[34px] leading-none md:text-[52px] lg:text-[60px] text-[var(--brand-primary)]">
            Mesa de regalos
          </h1>
        </header>

        <div className="ornament my-3">
          <span className="dot" aria-hidden="true"></span>
        </div>

        {/* Texto principal */}
        <p className="muted text-center text-sm md:text-base max-w-[720px] mx-auto">
          Nos hace mucha ilusión contar con ustedes y recibir un detalle en un día tan importante
          para nosotros. 
          Con mucho cariño hemos preparado nuestras mesas de regalos en{" "}
          <strong>MAX</strong> y <strong>Cemaco</strong>.  
          Puedes elegir la tienda que prefieras para hacernos tu obsequio.
        </p>

        {/* Sellos / logos */}
        <section className="grid gap-5 md:gap-8 md:grid-cols-2 place-items-center mt-2">
          {/* MAX */}
          <Link
            to="/regalos/max"
            aria-label="Ir a mesa de regalos MAX"
            className="transition-transform hover:scale-[1.02] focus-visible:scale-[1.02]"
          >
            <img
              src="/img/max.png"
              alt="Mesa de regalos MAX"
              className="w-full max-w-[260px] md:max-w-[300px] select-none"
              draggable={false}
            />
          </Link>

          {/* CEMACO */}
          <Link
            to="/regalos/cemaco"
            aria-label="Ir a mesa de regalos Cemaco"
            className="transition-transform hover:scale-[1.02] focus-visible:scale-[1.02]"
          >
            <img
              src="/img/cemaco.png"
              alt="Mesa de regalos Cemaco"
              className="w-full max-w-[260px] md:max-w-[300px] select-none"
              draggable={false}
            />
          </Link>
        </section>

        {/* Footer */}
        <div className="pt-2 flex justify-center">
          <Link to="/invitacion" className="btn-ghost">
            ← Volver a la invitación
          </Link>
        </div>
      </div>
    </section>
  )
}
