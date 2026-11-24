import { useId } from 'react'
import { useLanguage } from '../../i18n/useLanguage'
import { tryParseFormula, type FormulaResult } from '../../lib/formula'
import { Formula } from '../ui/Formula'
import { Sym } from '../ui/Num'

/**
 * Type a chemical formula and see its JAR/JMR/JFR worked out from the
 * periodic table. The parent reads the result with tryParseFormula.
 */
export default function MolarMassHelper({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { t } = useLanguage()
  const id = useId()
  const mm = t.calc.molarMass
  const parsed = value.trim() ? tryParseFormula(value) : null
  const error = parsed && !parsed.ok ? mm.errors[parsed.error.code].replace('{x}', parsed.error.detail) : null

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
          {mm.formulaLabel}
        </label>
        <input
          id={id}
          type="text"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder={mm.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          className={`w-full rounded-lg border bg-white px-3 py-2.5 text-base tracking-wide shadow-sm outline-none focus:ring-2 dark:bg-slate-950 ${
            error
              ? 'border-red-400 focus:ring-red-200 dark:border-red-500 dark:focus:ring-red-900'
              : 'border-slate-300 focus:border-teal-600 focus:ring-teal-100 dark:border-slate-700 dark:focus:ring-teal-900'
          }`}
        />
        {error ? (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : (
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{mm.hint}</p>
        )}
      </div>

      {parsed?.ok && <Breakdown result={parsed.result} />}
    </div>
  )
}

export function Breakdown({ result }: { result: FormulaResult }) {
  const { t } = useLanguage()
  const mm = t.calc.molarMass
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
          <tr>
            <th className="px-3 py-2 font-medium">{mm.element}</th>
            <th className="px-3 py-2 text-right font-medium">{mm.count}</th>
            <th className="px-3 py-2 text-right font-medium">{mm.jar}</th>
            <th className="px-3 py-2 text-right font-medium">{mm.subtotal}</th>
          </tr>
        </thead>
        <tbody className="tabular-nums">
          {result.breakdown.map((b) => (
            <tr key={b.symbol} className="border-t border-slate-100 dark:border-slate-800">
              <td className="px-3 py-1.5 font-semibold">{b.symbol}</td>
              <td className="px-3 py-1.5 text-right">{b.count}</td>
              <td className="px-3 py-1.5 text-right">{b.jar}</td>
              <td className="px-3 py-1.5 text-right">{round(b.subtotal)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-slate-200 bg-teal-50 font-semibold dark:border-slate-700 dark:bg-teal-950/40">
            <td colSpan={4} className="px-3 py-2">
              {mm.kind[result.kind]} <Formula text={result.formula} /> = {result.total}
              <span className="block text-xs font-normal text-slate-600 dark:text-slate-300">
                <Sym s="M" /> = {result.total} g mol⁻¹
              </span>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

const round = (n: number) => Math.round(n * 1000) / 1000
