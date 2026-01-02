import { Link } from "react-router-dom"

export default function Cemaco() {
  return (
    <section className="wrapper w-full min-h-[100svh] flex items-center justify-center py-8">
      <div className="card overflow-hidden w-full p-5 md:p-8 lg:p-10 space-y-6 md:space-y-7">


        {/* Header */}
        <header className="text-center">
          <h1 className="font-heading text-[34px] leading-none md:text-[52px] lg:text-[60px] text-[var(--brand-primary)]">
            Regalos en Cemaco
          </h1>
        </header>

        <div className="ornament my-3">
          <span className="dot" aria-hidden="true"></span>
        </div>

        {/* Introducción */}
        <p className="muted text-center text-sm md:text-base max-w-[760px] mx-auto">
          Si deseas comprarnos un regalo a través de <strong>Cemaco</strong>, puedes hacerlo
          de forma muy sencilla siguiendo estos pasos:
        </p>

        {/* PASO 1 */}
        <section className="space-y-2">
          <h2 className="font-heading text-[22px] md:text-[26px] text-[var(--brand-primary)]">
            1. Ingresa a nuestra lista
          </h2>
          <p className="muted text-sm md:text-base">
            Presiona el botón de <strong>Ver lista de regalos</strong> que aparece al final de esta sección.
            Serás dirigido directamente a nuestra lista de regalos en Cemaco.
          </p>
        </section>

        {/* PASO 2 */}
        <section className="space-y-2">
          <h2 className="font-heading text-[22px] md:text-[26px] text-[var(--brand-primary)]">
            2. Verifica que sea la lista correcta
          </h2>

          <p className="muted text-sm md:text-base">
            Al ingresar, asegúrate de que en la parte superior aparezca la siguiente información:
          </p>

          <ul className="list-disc ml-5 muted text-sm md:text-base space-y-1">
            <li><strong>BODA MARCOS Y NATALIA</strong></li>
            <li><strong>Juan Marcos Escobar Ballesteros & Natalia Gatica</strong></li>
          </ul>

          <p className="muted text-sm md:text-base">
            Si coincide, estás en la lista correcta.
          </p>
        </section>

        {/* PASO 3 */}
        <section className="space-y-2">
          <h2 className="font-heading text-[22px] md:text-[26px] text-[var(--brand-primary)]">
            5. Elige y compra el regalo
          </h2>

          <p className="muted text-sm md:text-base">
            Podrás ver todos los regalos disponibles. Para comprar:
          </p>

          <ol className="list-decimal ml-5 muted text-sm md:text-base space-y-1">
            <li>Selecciona el regalo que deseas.</li>
            <li>Presiona <strong>“Añadir al carrito”</strong>.</li>
            <li>Sigue las instrucciones en pantalla para completar la compra.</li>
          </ol>

          <p className="muted text-sm md:text-base">
            Cemaco registrará automáticamente el regalo a nuestro nombre.
          </p>
        </section>

        {/* PASO 4 */}
        <section className="space-y-2">
          <h2 className="font-heading text-[22px] md:text-[26px] text-[var(--brand-primary)]">
            Compra presencial en tienda Cemaco (opcional)
          </h2>

          <p className="muted text-sm md:text-base">
            Si prefieres realizar la compra de forma presencial, puedes hacerlo en
            cualquier tienda Cemaco.
          </p>
          <p className="muted text-sm md:text-base">
            Al llegar a la tienda, indica que deseas comprar un regalo de una lista de regalos
            y proporciona el siguiente número de evento:
          </p>

          <div className="rounded-lg border px-4 py-2 text-center font-semibold text-sm md:text-base bg-white/80"
               style={{ borderColor: "color-mix(in oklab, var(--brand-gold2) 55%, #fff)" }}>
            No. de evento: 202603-0024
          </div>

          <p className="muted text-sm md:text-base">
            Con este número, el personal de Cemaco podrá encontrar nuestra lista y ayudarte
            a realizar la compra.
          </p>
        </section>

        {/* BOTÓN CEMACO */}
        <div className="pt-4 flex justify-center">
          <a
            href="https://www.cemaco.com/list/bodamarcosynatalia"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Ir a registro de regalos Cemaco"
            className="transition-transform hover:scale-[1.02] focus-visible:scale-[1.02]"
          >
            <img
              src="/img/ver-lista.png"
              alt="Ver lista de regalos en Cemaco"
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
