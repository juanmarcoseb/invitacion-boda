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
            Serás dirigido a la página "Registro de regalos" de Cemaco.
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
            <li><strong>Primer nombre:</strong> Marcos</li>
            <li><strong>Apellido:</strong> Escobar</li>
            <li>
              <strong>Fecha de evento:</strong> 15/03/2026<br />
            </li>
          </ul>

          <p className="muted text-sm md:text-base">
            Luego presiona <strong>“Buscar”</strong>.
          </p>
        </section>

        {/* PASO 3 */}
        <section className="space-y-2">
          <h2 className="font-heading text-[22px] md:text-[26px] text-[var(--brand-primary)]">
            3. Selecciona nuestra lista
          </h2>

          <p className="muted text-sm md:text-base">
            Aparecerá un resultado con el nombre:
          </p>

          <div
            className="rounded-lg border px-4 py-2 text-center font-semibold text-sm md:text-base bg-white/80"
            style={{ borderColor: "color-mix(in oklab, var(--brand-gold2) 55%, #fff)" }}
          >
            BODA MARCOS Y NATALIA – Fecha: 15/03/2026
          </div>

          <p className="muted text-sm md:text-base">
            Haz clic en <strong>“Ver lista de regalos”</strong>.
          </p>
        </section>

        {/* PASO 4 */}
        <section className="space-y-2">
          <h2 className="font-heading text-[22px] md:text-[26px] text-[var(--brand-primary)]">
            4. Verifica que sea la lista correcta
          </h2>

          <p className="muted text-sm md:text-base">
            Al entrar, asegúrate de que en la parte superior aparezca:
          </p>

          <ul className="list-disc ml-5 muted text-sm md:text-base space-y-1">
            <li><strong>BODA MARCOS Y NATALIA</strong></li>
            <li><strong>Juan Marcos Escobar Ballesteros</strong></li>
            <li><strong>Fecha:</strong> 15/03/2026</li>
          </ul>

          <p className="muted text-sm md:text-base">
            Si coincide, estás en la lista correcta.
          </p>
        </section>

        {/* PASO 5 */}
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

        {/* BOTÓN CEMACO */}
        <div className="pt-4 flex justify-center">
          <a
            href="https://www.cemaco.com/registro-de-regalos"
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
