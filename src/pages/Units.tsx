import { useState } from 'react'
import { Num } from '../components/ui/Num'
import Segmented from '../components/ui/Segmented'
import { useLanguage } from '../i18n/useLanguage'
import { parseNumber } from '../lib/format'
import { UNITS, UNIT_LABELS, conversionFactor, convertUnit, type Dimension, type UnitOf } from '../lib/units'

/** Unit choices shown per dimension, with sensible defaults. */
const CHOICES: Record<Dimension, { units: string[]; from: string; to: string }> = {
  mass: { units: ['mg', 'g', 'kg'], from: 'g', to: 'kg' },
  volume: { units: ['cm3', 'dm3', 'm3', 'mL', 'L'], from: 'cm3', to: 'dm3' },
  amount: { units: ['mmol', 'mol'], from: 'mmol', to: 'mol' },
}

const selectClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base shadow-sm dark:border-slate-700 dark:bg-slate-950'

export default function Units() {
  const { t } = useLanguage()
  const u = t.unitsPage
  const [dim, setDim] = useState<Dimension>('volume')
  const [text, setText] = useState('250')
  const [from, setFrom] = useState(CHOICES.volume.from)
  const [to, setTo] = useState(CHOICES.volume.to)

  const changeDim = (d: Dimension) => {
    setDim(d)
    setFrom(CHOICES[d].from)
    setTo(CHOICES[d].to)
  }

  const value = parseNumber(text)
  const invalid = text.trim() !== '' && value === null
  const result = value === null ? null : convertUnit(dim, value, from as UnitOf<Dimension>, to as UnitOf<Dimension>)
  const factor = conversionFactor(dim, from as UnitOf<Dimension>, to as UnitOf<Dimension>)

  // Quick reference: every bigger unit expressed in each smaller one.
  const reference: [string, string, number][] = []
  for (const d of Object.keys(UNITS) as Dimension[]) {
    const units = CHOICES[d].units
    for (const a of units)
      for (const b of units) {
        const f = conversionFactor(d, a as UnitOf<Dimension>, b as UnitOf<Dimension>)
        if (f?.op === 'multiply' && !(d === 'volume' && (a === 'L' || b === 'mL'))) reference.push([a, b, f.value])
      }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">{u.title}</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">{u.subtitle}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <section className="min-w-0 space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {u.dimension}
            </p>
            <Segmented<Dimension>
              label={u.dimension}
              value={dim}
              onChange={changeDim}
              options={(['mass', 'volume', 'amount'] as const).map((d) => ({ value: d, label: u.dims[d] }))}
            />
          </div>

          <div>
            <label htmlFor="unit-value" className="mb-1.5 block text-sm font-medium">
              {u.value}
            </label>
            <input
              id="unit-value"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={text}
              onChange={(e) => setText(e.target.value)}
              aria-invalid={invalid}
              className={`w-full rounded-lg border bg-white px-3 py-2.5 text-lg tabular-nums shadow-sm outline-none focus:ring-2 dark:bg-slate-950 ${
                invalid
                  ? 'border-red-400 focus:ring-red-200 dark:border-red-500'
                  : 'border-slate-300 focus:border-teal-600 focus:ring-teal-100 dark:border-slate-700 dark:focus:ring-teal-900'
              }`}
            />
            {invalid && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{t.calc.errors.invalid}</p>}
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
            <div>
              <label htmlFor="unit-from" className="mb-1.5 block text-sm font-medium">
                {u.from}
              </label>
              <select id="unit-from" value={from} onChange={(e) => setFrom(e.target.value)} className={selectClass}>
                {CHOICES[dim].units.map((x) => (
                  <option key={x} value={x}>
                    {UNIT_LABELS[x]}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={() => {
                setFrom(to)
                setTo(from)
              }}
              aria-label={u.swap}
              title={u.swap}
              className="mb-0.5 grid h-10 w-10 place-items-center rounded-full border border-slate-300 text-lg hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              ⇄
            </button>
            <div>
              <label htmlFor="unit-to" className="mb-1.5 block text-sm font-medium">
                {u.to}
              </label>
              <select id="unit-to" value={to} onChange={(e) => setTo(e.target.value)} className={selectClass}>
                {CHOICES[dim].units.map((x) => (
                  <option key={x} value={x}>
                    {UNIT_LABELS[x]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div aria-live="polite" className="rounded-xl bg-orange-50 p-4 dark:bg-orange-950/30">
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-800 dark:text-orange-300">
              {u.result}
            </p>
            {result !== null && value !== null ? (
              <>
                <p className="mt-1 text-2xl font-bold sm:text-3xl">
                  <Num value={value} sigFigs={6} /> {UNIT_LABELS[from]} = <Num value={result} sigFigs={6} />{' '}
                  {UNIT_LABELS[to]}
                </p>
                <p className="mt-2 text-slate-700 dark:text-slate-300">
                  <span className="font-medium">{u.how}:</span>{' '}
                  {factor ? (
                    <>
                      <Num value={value} sigFigs={6} /> {factor.op === 'divide' ? '÷' : '×'} {factor.value} ={' '}
                      <Num value={result} sigFigs={6} />
                    </>
                  ) : (
                    u.same
                  )}
                </p>
              </>
            ) : (
              <p className="mt-1 text-slate-500">—</p>
            )}
          </div>
        </section>

        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-bold">{u.reference}</h2>
          <table className="mt-3 w-full text-base tabular-nums">
            <tbody>
              {reference.map(([a, b, f]) => (
                <tr key={a + b} className="border-t border-slate-100 first:border-0 dark:border-slate-800">
                  <td className="py-1.5">1 {UNIT_LABELS[a]}</td>
                  <td className="py-1.5 text-center text-slate-500 dark:text-slate-400">=</td>
                  <td className="py-1.5 text-right">
                    {f.toLocaleString('en')} {UNIT_LABELS[b]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{u.volumeTip}</p>
        </section>
      </div>
    </div>
  )
}
