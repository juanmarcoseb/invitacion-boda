import { useId, useMemo, useState } from "react"
import { supabase } from "../lib/supabase"

type Guest = {
  guest_id: string
  full_name: string
  household_id: string | null
  allowed_plus_ones: number
  is_confirmed: boolean
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

  const pinId = useId()
  const messageId = useId()

  const anySelectable = useMemo(() => rows.some(r => !r.is_confirmed), [rows])
  const allSelected = useMemo(
    () => rows.filter(r => !r.is_confirmed).every(r => r.selected),
    [rows]
  )
  const selectedCount = useMemo(
    () => rows.filter(r => r.selected && !r.is_confirmed).length,
    [rows]
  )

  const refreshHousehold = async (p: string) => {
    const { data, error } = await supabase
      .rpc("verify_pin_with_household_status", { p_pin: p })
    if (error) throw error
    const list = (data ?? []) as Guest[]
    setRows(
      list.map(g => ({
        guest_id: g.guest_id,
        full_name: g.full_name,
        is_confirmed: g.is_confirmed,
        selected: false,
        attending: "yes",
      }))
    )
  }

  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setOkMsg(null)
    setServerResults(null)
    try {
      await refreshHousehold(pin)
      setStep("form")
    } catch (err: any) {
      setError(err.message || "Ocurrió un error verificando el PIN.")
    } finally {
      setLoading(false)
    }
  }

  const toggleSelectAll = (checked: boolean) => {
    setRows(prev => prev.map(r => (r.is_confirmed ? r : { ...r, selected: checked })))
  }

  const setForSelected = (attending: "yes" | "no") => {
    setRows(prev =>
      prev.map(r => (r.selected && !r.is_confirmed ? { ...r, attending } : r))
    )
  }

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
        p_pin: pin,
        p_items: payload,
      })
      if (error) throw error

      const results = (data ?? []) as { guest_id: string; ok: boolean; result: string }[]
      setServerResults(results)

      await refreshHousehold(pin)

      const okTotal = results.filter(r => r.ok).length
      const skipped = results.length - okTotal
      setOkMsg(
        `Proceso terminado: ${okTotal} confirmad${okTotal === 1 ? "o" : "os"}${skipped > 0 ? `, ${skipped} omitid${skipped === 1 ? "o" : "os"}.` : "."}`
      )
    } catch (err: any) {
      setError(err.message || "No pudimos guardar el RSVP en lote. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  /* ===================== UI ===================== */

  if (step === "pin") {
    return (
      <section className="wrapper w-full">
        <div className="mx-auto max-w-[720px] card p-6 md:p-10">
          <header className="text-center mb-6">
            <h1 className="font-heading text-[44px] leading-none md:text-[64px] text-[var(--brand-primary)]">
              RSVP
            </h1>
            <div className="ornament my-3">
              <span className="dot" aria-hidden="true"></span>
            </div>
            <p className="muted text-base md:text-lg">
              Ingresa el <strong>PIN familiar</strong> que te compartimos en la invitación.
            </p>
          </header>

          <form onSubmit={handleVerifyPin} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor={pinId} className="block text-sm font-semibold">
                PIN de invitación
              </label>
              <input
                id={pinId}
                className="input text-lg"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="Ej.: 123456"
                value={pin}
                onChange={(e) => setPin(e.target.value.trim())}
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full md:w-auto"
              disabled={loading || pin.length === 0}
            >
              {loading ? "Verificando…" : "Continuar"}
            </button>

            {error && <p className="text-sm text-red-700">{error}</p>}
          </form>
        </div>
      </section>
    )
  }

  return (
    <section className="wrapper w-full">
      <div className="mx-auto max-w-[920px] card p-6 md:p-10 space-y-7">
        <header className="text-center">
          <h1 className="font-heading text-[42px] leading-none md:text-[60px] text-[var(--brand-primary)]">
            Confirmar asistencia
          </h1>
          <div className="ornament my-3">
            <span className="dot" aria-hidden="true"></span>
          </div>
          <p className="muted text-base md:text-lg">
            Selecciona a los miembros de tu familia, indica si asistirán y envía la confirmación.
          </p>
        </header>

        {/* Mensaje único */}
        <section className="space-y-2">
          <label htmlFor={messageId} className="block text-sm font-semibold">
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

        {/* Acciones rápidas */}
        <section className="flex flex-wrap items-center justify-between gap-3 border-t pt-5">
          <div className="flex items-center gap-2">
            <input
              id="selectAll"
              type="checkbox"
              className="check h-4 w-4"
              checked={anySelectable && allSelected}
              onChange={(e) => toggleSelectAll(e.target.checked)}
            />
            <label htmlFor="selectAll" className="text-sm">Seleccionar todos los pendientes</label>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span>Aplicar a seleccionados:</span>
            <button type="button" onClick={() => setForSelected("yes")} className="btn-ghost">
              Asistirán
            </button>
            <button type="button" onClick={() => setForSelected("no")} className="btn-ghost">
              No asistirán
            </button>
          </div>
        </section>

        {/* Lista de invitados con chips Sí/No */}
        <section className="space-y-3">
          {rows.length === 0 && (
            <div className="text-center py-10 muted">No hay invitados para este PIN.</div>
          )}

          {rows.map((r) => {
            const canEdit = !r.is_confirmed && r.selected
            return (
              <article key={r.guest_id} className="guest-row">
                {/* Selección */}
                <div className="flex items-start gap-3 md:items-center">
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
                    className="check mt-1 h-5 w-5 md:mt-0"
                    aria-label={`Seleccionar a ${r.full_name}`}
                  />
                  <div className={r.is_confirmed ? "opacity-60" : ""}>
                    <div className="font-heading text-[28px] leading-none text-[var(--brand-primary)]">
                      {r.full_name}
                    </div>
                    {r.is_confirmed && (
                      <div className="text-xs text-[var(--brand-primary)]">Ya confirmado</div>
                    )}
                    {!r.is_confirmed && !r.selected && (
                      <div className="text-xs muted">Marca para confirmar</div>
                    )}
                  </div>
                </div>

                {/* Chips Sí/No (solo activos si está seleccionado) */}
                <div className="flex gap-3 md:gap-4">
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

        {/* Footer acciones */}
        <section className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm muted">
            Seleccionados: <strong>{selectedCount}</strong>
          </p>
          <button
            type="submit"
            onClick={handleSubmitBulk}
            className="btn-primary w-full md:w-auto"
            disabled={loading || selectedCount === 0}
          >
            {loading ? "Enviando…" : "Confirmar seleccionados"}
          </button>
        </section>

        {/* Alertas */}
        {error && <p className="text-sm text-red-700">{error}</p>}
        {okMsg && <p className="text-sm" style={{ color: "var(--brand-primary)" }}>{okMsg}</p>}

        {/* Resultados por invitado */}
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
    </section>
  )
}
