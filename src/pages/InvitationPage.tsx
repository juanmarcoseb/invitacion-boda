import { Link } from "react-router-dom"
import { useEffect, useMemo, useRef, useState } from "react"

export default function InvitationPage() {
  const [phase, setPhase] = useState<"loading" | "opening" | "open">("loading")
  const [ready, setReady] = useState(false)

  const stageRef = useRef<HTMLDivElement | null>(null)
  const revealRefs = useRef<HTMLElement[]>([])

  // Precarga específica por breakpoint
  useEffect(() => {
    const desktopImgs = ["/img/completa.png"]
    const mobileImgs  = ["/img/sobre-abierto.png", "/img/carta.png"]
    const common      = ["/img/confirmacion.png", "/img/regalos.png", "/img/vestimenta.png"]

    const isMobile = window.matchMedia("(max-width: 767px)").matches
    const imgs = (isMobile ? mobileImgs : desktopImgs).concat(common)

    let loaded = 0
    imgs.forEach(src => {
      const i = new Image()
      i.onload = () => {
        loaded += 1
        if (loaded === imgs.length) {
          setReady(true)
          setPhase("opening")
        }
      }
      i.src = src
    })
  }, [])

  // completar animación
  useEffect(() => {
    if (phase === "opening") {
      const t = window.setTimeout(() => setPhase("open"), 1900)
      return () => window.clearTimeout(t)
    }
  }, [phase])

  const isOpen = phase === "open"
  const stageState = isOpen ? "is-open" : ""

  // clases (empalman con CSS)
  const deskCls = useMemo(
    () => ["desk-open", ready ? "is-ready" : "", phase !== "loading" ? "is-in" : ""].join(" "),
    [phase, ready]
  )
  const openCls = useMemo(
    () => ["env-open", ready ? "is-ready" : "", phase !== "loading" ? "is-in" : ""].join(" "),
    [phase, ready]
  )
  const letterCls = useMemo(
    () => ["letter", ready ? "is-ready" : "", phase !== "loading" ? "is-out" : ""].join(" "),
    [phase, ready]
  )

  /* ===== Parallax sutil por scroll (no afecta layout) ===== */
  useEffect(() => {
    if (!isOpen) return

    const root = document.documentElement
    const onScroll = () => {
      // progreso de 0 a 1 (solo primeros 1200px aprox.)
      const y = Math.min(window.scrollY, 1200)
      // movimientos muy suaves
      const par = Math.round(y * 0.06) // 0–72px
      const par2 = Math.round(y * 0.10) // 0–120px (la carta se mueve un poco más)
      root.style.setProperty("--par", `${par}px`)
      root.style.setProperty("--par2", `${par2}px`)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [isOpen])

  /* ===== Revelado de bloques inferiores al entrar a viewport ===== */
  useEffect(() => {
    const els = revealRefs.current
    if (!els.length) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view")
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.18 }
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [isOpen])

  // helper para registrar elementos a revelar
  const setRevealRef = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el)
    }
  }

  return (
    <section className="wrapper w-full">
      {/* Escenario */}
      <div ref={stageRef} className={`invite-stage mx-auto ${stageState}`}>
        {/* Desktop: imagen completa */}
        <img
          src="/img/completa.png"
          alt="Invitación abierta"
          className={deskCls}
          draggable={false}
        />
        {/* Móvil: sobre abierto + carta */}
        <img
          src="/img/sobre-abierto.png"
          alt="Sobre abierto"
          className={openCls}
          draggable={false}
        />
        <img
          src="/img/carta.png"
          alt="Tarjeta"
          className={letterCls}
          draggable={false}
        />
      </div>

      {/* Secciones inferiores */}
      <div className={`extras-wrap ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className="extras-grid">
          <Link
            to="/rsvp"
            aria-label="Ir a confirmar asistencia"
            className="block reveal"
            ref={setRevealRef as any}
          >
            <img
              src="/img/confirmacion.png"
              alt="Confirmación - Ir al RSVP"
              className="select-none"
              draggable={false}
            />
          </Link>

          <Link
            to="/regalos"
            aria-label="Ir a mesa de regalos"
            className="block reveal"
            ref={setRevealRef as any}
          >
            <img
              src="/img/regalos.png"
              alt="Mesa de regalos"
              className="select-none"
              draggable={false}
            />
          </Link>

        </div>

        {/* Código de vestimenta */}
        <div className="mt-6 grid place-items-center reveal" ref={setRevealRef as any}>
          <img
            src="/img/vestimenta.png"
            alt="Código de vestimenta"
            className="w-full h-auto max-w-[760px] select-none"
            draggable={false}
            loading="lazy"
          />
        </div>
      </div>
    </section>
  )
}
