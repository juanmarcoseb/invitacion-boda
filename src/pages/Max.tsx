import { Link } from "react-router-dom"

export default function Max() {
  return (
    <section className="wrapper w-full min-h-[100svh] flex items-center justify-center py-8">
      <div className="card overflow-hidden w-full p-5 md:p-8 lg:p-10 space-y-6 md:space-y-7">


        {/* Header */}
        <header className="text-center">
          <h1 className="font-heading text-[34px] leading-none md:text-[52px] lg:text-[60px] text-[var(--brand-primary)]">
            Regalos en Max
          </h1>
        </header>

        <div className="ornament my-3">
          <span className="dot" aria-hidden="true"></span>
        </div>

        {/* Introducción */}
        <p className="muted text-center text-sm md:text-base max-w-[760px] mx-auto">
          Si deseas comprarnos un regalo por medio de <strong>MAX</strong>, puedes hacerlo
          siguiendo estos sencillos pasos:
        </p>

        {/* PASO 1 */}
        <section className="space-y-2">
          <h2 className="font-heading text-[22px] md:text-[26px] text-[var(--brand-primary)]">
            1. Ingresa a nuestra lista de regalos
          </h2>
          <p className="muted text-sm md:text-base">
            Presiona el botón de <strong>Ver lista de regalos</strong> que aparece al final de esta sección.
            Serás dirigido a la página de Bodas MAX.
          </p>
        </section>

        {/* PASO 2 */}
        <section className="space-y-2">
          <h2 className="font-heading text-[22px] md:text-[26px] text-[var(--brand-primary)]">
            2. Llena el formulario de búsqueda
          </h2>

          <p className="muted text-sm md:text-base">
            En la pantalla que aparece, ingresa los siguientes datos:
          </p>

          <ul className="list-disc ml-5 muted text-sm md:text-base space-y-1">
            <li><strong>Nombre:</strong> Marcos o Naty</li>
            <li><strong>Apellido:</strong> Escobar o Gatica</li>
            <li>
              <strong>Mes:</strong> Selecciona <strong>Marzo</strong><br />
            </li>
            <li><strong>Año:</strong> 2026</li>
          </ul>

          <p className="muted text-sm md:text-base">
            Luego presiona <strong>"Buscar boda"</strong>.
          </p>
        </section>

        {/* PASO 3 */}
        <section className="space-y-2">
          <h2 className="font-heading text-[22px] md:text-[26px] text-[var(--brand-primary)]">
            3. Selecciona nuestra lista
          </h2>
          <p className="muted text-sm md:text-base">
            Aparecerá un cuadro con nuestra lista de regalos. Busca la que aparece como:
          </p>

          <div className="rounded-lg border px-4 py-2 text-center font-semibold text-sm md:text-base bg-white/80"
               style={{ borderColor: "color-mix(in oklab, var(--brand-gold2) 55%, #fff)" }}>
            Escobar Gatica – 15/03/2026
          </div>

          <p className="muted text-sm md:text-base">
            Presiona ese cuadro.
          </p>
        </section>

        {/* PASO 4 */}
        <section className="space-y-2">
          <h2 className="font-heading text-[22px] md:text-[26px] text-[var(--brand-primary)]">
            4. Elige el regalo
          </h2>
          <p className="muted text-sm md:text-base">
            Ya podrás ver todos los regalos disponibles en nuestra lista:
          </p>

          <ul className="list-disc ml-5 muted text-sm md:text-base space-y-1">
            <li>
              Si el regalo tiene un botón que dice <strong>“Añadir”</strong>, puedes comprarlo en línea.
              Solo agrégalo al carrito y sigue las instrucciones para pagar.
            </li>
            <li>
              Si el regalo dice <strong>“Solo disponible en tiendas”</strong>, deberás comprarlo
              directamente en una tienda MAX.
            </li>
          </ul>
        </section>

        {/* PASO 5 */}
        <section className="space-y-2">
          <h2 className="font-heading text-[22px] md:text-[26px] text-[var(--brand-primary)]">
            5. Si compras en tienda
          </h2>
          <p className="muted text-sm md:text-base">
            Puedes ir a cualquier tienda MAX e indicar:
          </p>

          <div className="rounded-lg border px-4 py-3 text-center italic text-sm md:text-base bg-white/80"
               style={{ borderColor: "color-mix(in oklab, var(--brand-gold2) 55%, #fff)" }}>
            “Quiero comprar un regalo para la lista de boda de Marcos Escobar y Natalia Gatica,
            fecha 15 de marzo de 2026.”
          </div>
        </section>

        {/* BOTÓN MAX */}
        <div className="pt-4 flex justify-center">
          <a
            href="https://www2.max.com.gt/bodas"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Ir a Bodas MAX"
            className="transition-transform hover:scale-[1.02] focus-visible:scale-[1.02]"
          >
            <img
              src="/img/ver-lista.png"
              alt="Ver lista de regalos en MAX"
              className="w-full max-w-[300px] select-none"
              draggable={false}
            />
          </a>
        </div>

        {/* Footer volver */}
        <div className="pt-2 flex justify-center">
          <Link to="/regalos" className="btn-ghost">
            ← Volver a mesa de regalos
          </Link>
        </div>
      </div>
    </section>
  )
}
