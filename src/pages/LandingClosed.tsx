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
      i.onload = () => { loaded += 1; if (loaded === imgs.length) setReady(true) }
      i.src = src
    })
  }, [])

  return (
    <section className="wrapper w-full p-0">
      <div className="hero-closed">
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
            className="seal-hitbox"
            onClick={() => nav("/invitacion")}
          />
        )}
      </div>
    </section>
  )
}
