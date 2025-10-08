import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function LandingClosed() {
  const nav = useNavigate()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const imgs = ["/img/sobre-cerrado.png"]
    let loaded = 0
    imgs.forEach(src => {
      const i = new Image()
      i.onload = () => {
        loaded += 1
        if (loaded === imgs.length) setReady(true)
      }
      i.src = src
    })
  }, [])

  // Parallax muy suave con scroll
  useEffect(() => {
    if (!ready) return
    const root = document.documentElement
    const onScroll = () => {
      const y = Math.min(window.scrollY, 800)
      const par = Math.round(y * 0.05) // mueve el sobre un poco al hacer scroll
      root.style.setProperty("--parClosed", `${par}px`)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [ready])

  return (
    <section className="wrapper w-full p-0">
      <div className={`hero-closed fade-in ${ready ? "is-ready" : ""}`}>
        <img
          src="/img/sobre-cerrado.png"
          alt="Sobre cerrado"
          className="hero-closed__img"
          draggable={false}
        />
        {/* hitbox sobre el sello */}
        {ready && (
          <button
            aria-label="Abrir invitación"
            className="seal-hitbox fancy"
            onClick={() => nav("/invitacion")}
          />
        )}
      </div>
    </section>
  )
}
