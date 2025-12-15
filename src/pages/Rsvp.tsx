import { useId, useMemo, useState } from "react"
import { Link } from "react-router-dom"          // <-- agregado
import { supabase } from "../lib/supabase"

type Guest = {
  guest_id: string
  full_name: string
  household_id: string | null
  allowed_plus_ones: number
  is_confirmed: boolean
  attending: boolean | null
}

type Row = {
  guest_id: string
  full_name: string
  is_confirmed: boolean
  selected: boolean
  attending: "yes" | "no"
}

export default function Rsvp() {
  const [step, setStep] = useState<"pin" | "form">("pin")
  const [pin, setPin] = useState("")
  const [message, setMessage] = useState("")

  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [okMsg, setOkMsg] = useState<string | null>(null)
  const [serverResults, setServerResults] = useState<
    { guest_id: string; ok: boolean; result: string }[] | null
  >(null)

  // <-- NUEVO: tamaño de familia para el mensaje
  const [householdSize, setHouseholdSize] = useState<number | null>(null)

  const [showGiftModal, setShowGiftModal] = useState(false)

  const pinId = useId()
  const messageId = useId()

  /*const anySelectable = useMemo(() => rows.some(r => !r.is_confirmed), [rows])
  const allSelected = useMemo(
    () => rows.filter(r => !r.is_confirmed).every(r => r.selected),
    [rows]
  )*/
  const selectedCount = useMemo(
    () => rows.filter(r => r.selected && !r.is_confirmed).length,
    [rows]
  )

  // devuelve cuántos invitados hay para el PIN (además de setRows)
  const refreshHousehold = async (p: string): Promise<number> => {
    const { data, error } = await supabase
      .rpc("verify_pin_with_household_status_v2", { p_pin: p })
    if (error) throw error

    const list = (data ?? []) as Guest[]
    setRows(
      list.map(g => ({
        guest_id: g.guest_id,
        full_name: g.full_name,
        is_confirmed: g.is_confirmed,
        selected: false,
        attending:
          g.attending === null || g.attending === undefined
            ? "yes"
            : g.attending
            ? "yes"
            : "no",
      }))
    )
    setHouseholdSize(list.length) // <-- NUEVO
    return list.length
  }

  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setOkMsg(null)
    setServerResults(null)
    try {
      const cleanPin = pin.trim()
      const count = await refreshHousehold(cleanPin)

      if (count > 0) {
        setStep("form")
      } else {
        setError("PIN no válido. Verifica el PIN e inténtalo de nuevo.")
        setStep("pin")
      }
    } catch (err: any) {
      setError(err.message || "Ocurrió un error verificando el PIN.")
      setStep("pin")
    } finally {
      setLoading(false)
    }
  }

  /*const toggleSelectAll = (checked: boolean) => {
    setRows(prev => prev.map(r => (r.is_confirmed ? r : { ...r, selected: checked })))
  }

  const setForSelected = (attending: "yes" | "no") => {
    setRows(prev =>
      prev.map(r => (r.selected && !r.is_confirmed ? { ...r, attending } : r))
    )
  }*/

  const handleSubmitBulk = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setOkMsg(null)
    setServerResults(null)

    try {
      const payload = rows
        .filter(r => r.selected && !r.is_confirmed)
        .map(r => ({
          guest_id: r.guest_id,
          attending: r.attending === "yes",
          message: message || null,
        }))

      if (payload.length === 0) {
        setError("Selecciona al menos una persona pendiente por confirmar.")
        setLoading(false)
        return
      }

      const { data, error } = await supabase.rpc("submit_rsvp_bulk", {
        p_pin: pin.trim(),
        p_items: payload,
      })
      if (error) throw error

      const results = (data ?? []) as { guest_id: string; ok: boolean; result: string }[]
      setServerResults(results)

      await refreshHousehold(pin.trim())

      const okTotal = results.filter(r => r.ok).length
      const skipped = results.length - okTotal
      setOkMsg(
        `Proceso terminado: ${okTotal} confirmad${okTotal === 1 ? "o" : "os"}${skipped > 0 ? `, ${skipped} omitid${skipped === 1 ? "o" : "os"}.` : "."}`
      )
      setShowGiftModal(true)
    } catch (err: any) {
      setError(err.message || "No pudimos guardar el RSVP en lote. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  /* ===================== UI ===================== */

  if (step === "pin") {
    return (
      <section className="wrapper w-full min-h-[100svh] flex items-center justify-center py-8">
        <div className="card overflow-hidden w-full p-5 md:p-8 lg:p-10">
          {/* botón volver */}
          <div className="mb-3">
            <Link to="/invitacion" className="btn-ghost inline-flex">
              ← Volver a la invitación
            </Link>
          </div>

          <header className="text-center mb-5 md:mb-6">
            <h1 className="font-heading text-[36px] leading-none md:text-[56px] lg:text-[64px] text-[var(--brand-primary)]">
              RSVP
            </h1>
            <div className="ornament my-3">
              <span className="dot" aria-hidden="true"></span>
            </div>
            <p className="muted text-sm md:text-base">
              Ingresa el <strong>PIN</strong> que te compartimos en la invitación.
            </p>
          </header>

          <form onSubmit={handleVerifyPin} className="space-y-4 md:space-y-5">
            <div className="space-y-2">
              <label htmlFor={pinId} className="block text-xs md:text-sm font-semibold">
                PIN de invitación
              </label>
              <input
                id={pinId}
                className="input text-base md:text-lg"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="Ej.: 123456"
                value={pin}
                onChange={(e) => setPin(e.target.value.trim())}
              />
            </div>

            <div className="actions-group">
              <button
                type="submit"
                className="btn-primary"
                disabled={loading || pin.trim().length === 0}
              >
                {loading ? "Verificando…" : "Continuar"}
              </button>
            </div>

            {error && <p className="text-sm text-red-700">{error}</p>}
          </form>
        </div>
      </section>
    )
  }

  return (
    <section className="wrapper w-full">
      <div className="card overflow-hidden p-5 md:p-8 lg:p-10 space-y-6 md:space-y-7">
        {/* botón volver arriba 
        <div className="flex justify-end">
          <Link to="/invitacion" className="btn-ghost">
            ← Volver a la invitación
          </Link>
        </div>*/}

        <header className="text-center">
          <h1 className="font-heading text-[34px] leading-none md:text-[52px] lg:text-[60px] text-[var(--brand-primary)]">
            Confirmar asistencia
          </h1>
        </header>

        <div className="ornament my-3">
          <span className="dot" aria-hidden="true"></span>
        </div>

        {/* NUEVO: Aviso de cupo por familia */}
        {householdSize !== null && householdSize > 0 && (
          <p className="muted text-center text-sm md:text-base">
            Tu invitación es únicamente para <strong>{householdSize}</strong> persona{householdSize === 1 ? "" : "s"}:
            las que aparecen en la lista. <span className="whitespace-nowrap">No se permiten</span> acompañantes adicionales.
          </p>
        )}

        <p className="muted text-center text-sm md:text-base">
          Selecciona a los miembros de tu familia, indica si asistirán y envía la confirmación.
        </p>

        {/* Mensaje único */}
        <section className="space-y-2">
          <label htmlFor={messageId} className="block text-xs md:text-sm font-semibold">
            Mensaje para los novios <span className="muted font-normal">(opcional)</span>
          </label>
          <textarea
            id={messageId}
            rows={3}
            placeholder="¡Con gusto estaremos ahí!"
            className="input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </section>

        {/* Acciones rápidas (comentadas por ti, se dejan tal cual) */}
        {/* ... */}

        {/* Lista de invitados */}
        <section className="space-y-3">
          {rows.length === 0 && (
            <div className="text-center py-10 muted">No hay invitados para este PIN.</div>
          )}

          {rows.map((r) => {
            const canEdit = !r.is_confirmed && r.selected
            const finalBadge =
              r.is_confirmed ? (r.attending === "yes" ? "ASISTE" : "NO ASISTE") : null

            return (
              <article key={r.guest_id} className="guest-row">
                <div className="guest-row__top">
                  <input
                    type="checkbox"
                    disabled={r.is_confirmed}
                    checked={r.selected && !r.is_confirmed}
                    onChange={(e) => {
                      const checked = e.target.checked
                      setRows(prev =>
                        prev.map(x => x.guest_id === r.guest_id ? { ...x, selected: checked } : x)
                      )
                    }}
                    className="check mt-[2px] h-5 w-5 md:mt-0"
                    aria-label={`Seleccionar a ${r.full_name}`}
                  />
                  <div className={r.is_confirmed ? "opacity-80" : ""}>
                    <div className="font-heading text-[24px] leading-none md:text-[28px] text-[var(--brand-primary)]">
                      {r.full_name}
                    </div>

                    {!r.is_confirmed && !r.selected && (
                      <div className="text-xs muted">Marca para confirmar</div>
                    )}
                    {r.is_confirmed && finalBadge && (
                      <div className="mt-1 inline-flex items-center gap-2">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                          ${r.attending === "yes"
                            ? "bg-[rgba(51,78,54,.12)] text-[var(--brand-primary)] border border-[rgba(51,78,54,.25)]"
                            : "bg-[rgba(0,0,0,.06)] text-[#333] border border-[rgba(0,0,0,.12)]"
                          }`}>
                          {finalBadge}
                        </span>
                        <span className="text-xs muted">(ya confirmado)</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="guest-row__options">
                  <label className={`chip ${canEdit && r.attending === "yes" ? "is-on" : ""}`}>
                    <input
                      type="radio"
                      className="sr-only"
                      name={`attending-${r.guest_id}`}
                      value="yes"
                      checked={r.attending === "yes"}
                      disabled={!canEdit}
                      onChange={() => {
                        setRows(prev =>
                          prev.map(x => x.guest_id === r.guest_id ? { ...x, attending: "yes" } : x)
                        )
                      }}
                    />
                    Sí
                  </label>

                  <label className={`chip ${canEdit && r.attending === "no" ? "is-on" : ""}`}>
                    <input
                      type="radio"
                      className="sr-only"
                      name={`attending-${r.guest_id}`}
                      value="no"
                      checked={r.attending === "no"}
                      disabled={!canEdit}
                      onChange={() => {
                        setRows(prev =>
                          prev.map(x => x.guest_id === r.guest_id ? { ...x, attending: "no" } : x)
                        )
                      }}
                    />
                    No
                  </label>
                </div>
              </article>
            )
          })}
        </section>

        {/* Footer */}
        <section className="grid gap-3 md:flex md:items-center md:justify-between">
          <p className="text-sm muted text-center md:text-left">
            Seleccionados: <strong>{selectedCount}</strong>
          </p>
          <div className="actions-group">
            <Link to="/invitacion" className="btn-ghost">
              ← Volver a la invitación
            </Link>
            <button
              type="submit"
              onClick={handleSubmitBulk}
              className="btn-primary"
              disabled={loading || selectedCount === 0}
            >
              {loading ? "Enviando…" : "Confirmar seleccionados"}
            </button>
          </div>
        </section>

        {error && <p className="text-sm text-red-700">{error}</p>}
        {okMsg && <p className="text-sm" style={{ color: "var(--brand-primary)" }}>{okMsg}</p>}

        {serverResults && serverResults.length > 0 && (
          <section
            className="rounded-xl border p-4 text-sm bg-white/90"
            style={{ borderColor: "color-mix(in oklab, var(--brand-gold2) 55%, #fff)" }}
          >
            <p className="font-semibold mb-2">Resultados:</p>
            <ul className="list-disc ml-5 space-y-1">
              {serverResults.map(res => {
                const g = rows.find(r => r.guest_id === res.guest_id)
                return (
                  <li key={res.guest_id}>
                    <span className="font-medium">{g?.full_name || res.guest_id}:</span> {res.result}
                  </li>
                )
              })}
            </ul>
          </section>
        )}
      </div>
      {showGiftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-[90%] p-6 md:p-8 text-center">
            
            {/* Botón cerrar */}
            <button
              onClick={() => setShowGiftModal(false)}
              className="absolute top-3 right-3 text-sm muted hover:opacity-70"
              aria-label="Cerrar"
            >
              ✕
            </button>

            {/* Imagen sello */}
            <img
              src="/img/sello-regalo.png"
              alt="Regalos"
              className="mx-auto w-40 md:w-44 mb-5"
            />

            {/* Texto */}
            <p className="font-heading text-[22px] md:text-[26px] text-[var(--brand-primary)] leading-snug mb-3">
              ¡Gracias por confirmar!
            </p>

            <p className="muted text-sm md:text-base mb-6">
              Si deseas darnos un regalo, puedes hacerlo aquí.
            </p>

            {/* Botón regalos */}
            <Link
              to="/regalos"
              className="btn-primary inline-flex justify-center"
              onClick={() => setShowGiftModal(false)}
            >
              Ver lista de regalos
            </Link>
          </div>
        </div>
      )}

    </section>
  )
}
