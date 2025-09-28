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

  if (step === "pin") {
    return (
      <section className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-3xl font-bold text-center">Confirmar asistencia (RSVP)</h1>
        <p className="text-center opacity-80">
          Ingresa el PIN familiar que te compartimos en la invitación.
        </p>
        <form onSubmit={handleVerifyPin} className="space-y-4 bg-white p-4 rounded-xl shadow">
          <label htmlFor={pinId} className="block text-sm font-medium">PIN de invitación</label>
          <input
            id={pinId}
            className="w-full rounded border px-3 py-2"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="Ej.: 123456"
            value={pin}
            onChange={(e) => setPin(e.target.value.trim())}
          />
          <button
            type="submit"
            className="w-full rounded bg-black text-white py-2 font-semibold disabled:opacity-50"
            disabled={loading || pin.length === 0}
          >
            {loading ? "Verificando..." : "Continuar"}
          </button>
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold text-center">Confirmar asistencia (RSVP)</h1>

      <form onSubmit={handleSubmitBulk} className="space-y-5 bg-white p-4 rounded-xl shadow">
        {/* Mensaje único */}
        <div className="space-y-1">
          <label htmlFor={messageId} className="block text-sm font-medium">
            Mensaje para los novios (opcional)
          </label>
          <textarea
            id={messageId}
            rows={3}
            placeholder="¡Con gusto estaremos ahí!"
            className="w-full rounded border px-3 py-2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        {/* Acciones rápidas */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <input
              id="selectAll"
              type="checkbox"
              checked={anySelectable && allSelected}
              onChange={(e) => toggleSelectAll(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="selectAll" className="text-sm">Seleccionar todos los pendientes</label>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span>Aplicar a seleccionados:</span>
            <button type="button" onClick={() => setForSelected("yes")} className="rounded border px-2 py-1">
              Asistirán
            </button>
            <button type="button" onClick={() => setForSelected("no")} className="rounded border px-2 py-1">
              No asistirán
            </button>
          </div>
        </div>

        {/* Tabla de invitados */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 pr-3">Sel.</th>
                <th className="py-2 pr-3">Nombre</th>
                <th className="py-2 pr-3">Asistencia</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.guest_id} className="border-b align-top">
                  <td className="py-2 pr-3">
                    <input
                      type="checkbox"
                      disabled={r.is_confirmed}
                      checked={r.selected && !r.is_confirmed}
                      onChange={(e) => {
                        const checked = e.target.checked
                        setRows(prev => prev.map(x => x.guest_id === r.guest_id ? { ...x, selected: checked } : x))
                      }}
                      className="h-4 w-4"
                      aria-label={`Seleccionar a ${r.full_name}`}
                    />
                  </td>
                  <td className="py-2 pr-3">
                    <div className={r.is_confirmed ? "opacity-60" : ""}>
                      {r.full_name} {r.is_confirmed && <span className="text-xs text-green-700">(ya confirmado)</span>}
                    </div>
                  </td>
                  <td className="py-2 pr-3">
                    <div className="flex gap-3">
                      <label className="inline-flex items-center gap-1">
                        <input
                          type="radio"
                          name={`attending-${r.guest_id}`}
                          value="yes"
                          checked={r.attending === "yes"}
                          disabled={r.is_confirmed || !r.selected}
                          onChange={() => {
                            setRows(prev => prev.map(x => x.guest_id === r.guest_id ? { ...x, attending: "yes" } : x))
                          }}
                        />
                        <span>Sí</span>
                      </label>
                      <label className="inline-flex items-center gap-1">
                        <input
                          type="radio"
                          name={`attending-${r.guest_id}`}
                          value="no"
                          checked={r.attending === "no"}
                          disabled={r.is_confirmed || !r.selected}
                          onChange={() => {
                            setRows(prev => prev.map(x => x.guest_id === r.guest_id ? { ...x, attending: "no" } : x))
                          }}
                        />
                        <span>No</span>
                      </label>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={3} className="py-6 text-center opacity-70">No hay invitados para este PIN.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm opacity-80">
            Seleccionados: <strong>{selectedCount}</strong>
          </p>
          <button
            type="submit"
            className="rounded bg-black text-white px-4 py-2 font-semibold disabled:opacity-50"
            disabled={loading || selectedCount === 0}
          >
            {loading ? "Enviando..." : "Confirmar seleccionados"}
          </button>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {okMsg && <p className="text-green-700 text-sm">{okMsg}</p>}

        {serverResults && serverResults.length > 0 && (
          <div className="rounded-lg border p-3 text-sm">
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
          </div>
        )}
      </form>
    </section>
  )
}
