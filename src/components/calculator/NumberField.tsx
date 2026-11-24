import { useId, type ReactNode } from 'react'
import { UNIT_LABELS } from '../../lib/units'
import type { FieldValue } from './field'

// Width is set per input (not here) so the main box and the exponent box don't fight over it.
const inputClass =
  'min-w-0 rounded-lg border bg-white py-2.5 text-base tabular-nums shadow-sm outline-none transition focus:ring-2 dark:bg-slate-950'

export default function NumberField({
  label,
  symbol,
  value,
  onChange,
  error,
  scientific = false,
  units,
  unit,
  onUnitChange,
  unitSuffix,
  placeholder,
}: {
  label: string
  symbol: ReactNode
  value: FieldValue
  onChange: (v: FieldValue) => void
  error?: string | null
  /** Show separate "× 10^" exponent box, handy for numbers of particles. */
  scientific?: boolean
  /** Unit choices; shows a dropdown when there is more than one. */
  units?: readonly string[]
  unit?: string
  onUnitChange?: (u: string) => void
  /** Fixed unit text shown after the box (when there is no dropdown). */
  unitSuffix?: ReactNode
  placeholder?: string
}) {
  const id = useId()
  const errorId = `${id}-error`
  const border = error
    ? 'border-red-400 focus:ring-red-200 dark:border-red-500 dark:focus:ring-red-900'
    : 'border-slate-300 focus:border-teal-600 focus:ring-teal-100 dark:border-slate-700 dark:focus:ring-teal-900'

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-baseline gap-1.5 text-sm font-medium">
        {label} <span className="text-slate-500 dark:text-slate-400">({symbol})</span>
      </label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          placeholder={placeholder}
          value={value.text}
          onChange={(e) => onChange({ ...value, text: e.target.value })}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`${inputClass} ${border} flex-1 px-3`}
        />
        {scientific && (
          <>
            <span className="shrink-0 text-slate-600 dark:text-slate-300">
              × 10<sup>n</sup>
            </span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              aria-label={`${label}: power of ten`}
              placeholder="23"
              value={value.exponent}
              onChange={(e) => onChange({ ...value, exponent: e.target.value })}
              aria-invalid={!!error}
              className={`${inputClass} ${border} w-20 shrink-0 px-2 text-center`}
            />
          </>
        )}
        {units && units.length > 1 && unit && onUnitChange ? (
          <select
            aria-label={`${label}: unit`}
            value={unit}
            onChange={(e) => onUnitChange(e.target.value)}
            className="shrink-0 rounded-lg border border-slate-300 bg-white px-2 py-2.5 text-base shadow-sm dark:border-slate-700 dark:bg-slate-950"
          >
            {units.map((u) => (
              <option key={u} value={u}>
                {UNIT_LABELS[u] ?? u}
              </option>
            ))}
          </select>
        ) : (
          unitSuffix && <span className="shrink-0 text-sm text-slate-600 dark:text-slate-300">{unitSuffix}</span>
        )}
      </div>
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}
