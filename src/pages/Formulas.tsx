import type { ReactNode } from 'react'
import RajahDiagram from '../components/RajahDiagram'
import { Sym } from '../components/ui/Num'
import { useLanguage } from '../i18n/useLanguage'

/** A stacked fraction, e.g. N over N_A. */
function Frac({ top, bottom }: { top: ReactNode; bottom: ReactNode }) {
  return (
    <span className="mx-0.5 inline-flex flex-col items-center align-middle leading-tight">
      <span className="border-b border-current px-1">{top}</span>
      <span className="px-1">{bottom}</span>
    </span>
  )
}

const S = (s: string) => <Sym s={s} />

export default function Formulas() {
  const { t } = useLanguage()
  const f = t.formulas

  const relationships = [
    {
      title: t.calc.tabs.particles,
      border: 'border-l-particles',
      main: (
        <>
          {S('n')} = <Frac top={S('N')} bottom={S('N_A')} />
        </>
      ),
      others: [<>{S('N')} = {S('n')} × {S('N_A')}</>],
      legend: [
        [S('n'), t.calc.vars.n, 'mol'],
        [S('N'), t.calc.vars.N, '—'],
        [S('N_A'), t.calc.vars.NA, 'mol⁻¹'],
      ],
    },
    {
      title: t.calc.tabs.mass,
      border: 'border-l-mass',
      main: (
        <>
          {S('n')} = <Frac top={S('m')} bottom={S('M')} />
        </>
      ),
      others: [
        <>{S('m')} = {S('n')} × {S('M')}</>,
        <>
          {S('M')} = <Frac top={S('m')} bottom={S('n')} />
        </>,
      ],
      legend: [
        [S('m'), t.calc.vars.m, 'g'],
        [S('M'), t.calc.vars.M, 'g mol⁻¹'],
      ],
    },
    {
      title: t.calc.tabs.volume,
      border: 'border-l-volume',
      main: (
        <>
          {S('n')} = <Frac top={S('V')} bottom={S('V_m')} />
        </>
      ),
      others: [
        <>{S('V')} = {S('n')} × {S('V_m')}</>,
        <>
          {S('V_m')} = <Frac top={S('V')} bottom={S('n')} />
        </>,
      ],
      legend: [
        [S('V'), t.calc.vars.V, 'dm³'],
        [S('V_m'), t.calc.vars.Vm, 'dm³ mol⁻¹'],
      ],
    },
  ] as const

  const unitRows: [string, string][] = [
    ['1 kg', '1000 g'],
    ['1 g', '1000 mg'],
    ['1 dm³', '1000 cm³'],
    ['1 dm³', '1 L'],
    ['1 m³', '1000 dm³'],
    ['1 mol', '1000 mmol'],
  ]

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{f.title}</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">{f.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold shadow-sm hover:bg-slate-50 print:hidden dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <path d="M6 14h12v8H6z" />
          </svg>
          {f.print}
        </button>
      </header>

      <section className="sheet-card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 print:break-inside-avoid dark:border-slate-800 dark:bg-slate-900">
        <RajahDiagram />
      </section>

      <section>
        <h2 className="mb-3 text-xl font-bold">{f.relationships}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {relationships.map((r) => (
            <article
              key={r.title}
              className={`sheet-card rounded-2xl border border-l-4 border-slate-200 bg-white p-5 shadow-sm print:break-inside-avoid dark:border-slate-800 dark:bg-slate-900 ${r.border}`}
            >
              <h3 className="font-semibold">{r.title}</h3>
              <p className="mt-3 text-center text-3xl">{r.main}</p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {f.rearrange}
              </p>
              <ul className="mt-1 space-y-1 text-lg">
                {r.others.map((o, i) => (
                  <li key={i}>{o}</li>
                ))}
              </ul>
              <dl className="mt-4 space-y-0.5 border-t border-slate-100 pt-3 text-sm dark:border-slate-800">
                {r.legend.map(([sym, name, unit], i) => (
                  <div key={i} className="flex gap-2">
                    <dt className="w-8 shrink-0">{sym}</dt>
                    <dd className="text-slate-600 dark:text-slate-300">
                      {name} <span className="text-slate-500 dark:text-slate-400">({unit})</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="sheet-card rounded-2xl border border-orange-200 bg-orange-50 p-5 text-center sm:p-6 print:break-inside-avoid dark:border-orange-900 dark:bg-orange-950/30">
        <h2 className="text-xl font-bold">{f.allInOne}</h2>
        <p className="mt-1 text-slate-600 dark:text-slate-300">{f.allInOneText}</p>
        <p className="mt-4 text-2xl sm:text-3xl">
          {S('n')} = <Frac top={S('N')} bottom={S('N_A')} /> = <Frac top={S('m')} bottom={S('M')} /> ={' '}
          <Frac top={S('V')} bottom={S('V_m')} />
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="sheet-card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm print:break-inside-avoid dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-bold">{f.constants}</h2>
          <ul className="mt-3 space-y-2 text-lg">
            <li>
              {S('N_A')} = 6.02 × 10<sup>23</sup> mol⁻¹
            </li>
            <li>
              {S('V_m')} = 24 dm³ mol⁻¹ <span className="text-sm text-slate-500 dark:text-slate-400">({f.room})</span>
            </li>
            <li>
              {S('V_m')} = 22.4 dm³ mol⁻¹ <span className="text-sm text-slate-500 dark:text-slate-400">({f.stp})</span>
            </li>
          </ul>
        </section>

        <section className="sheet-card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm print:break-inside-avoid dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-bold">{f.relative}</h2>
          <ul className="mt-3 space-y-2">
            <li>
              <strong>{f.abbr.jmr}</strong> = {f.jmrDef}
            </li>
            <li>
              <strong>{f.abbr.jfr}</strong> = {f.jfrDef}
            </li>
            <li className="text-lg">
              {S('M')} (g mol⁻¹) = {f.abbr.jar} / {f.abbr.jmr} / {f.abbr.jfr}
            </li>
          </ul>
        </section>

        <section className="sheet-card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm print:break-inside-avoid dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-bold">{f.units}</h2>
          <table className="mt-3 w-full text-lg tabular-nums">
            <tbody>
              {unitRows.map(([a, b], i) => (
                <tr key={i} className="border-t border-slate-100 first:border-0 dark:border-slate-800">
                  <td className="py-1.5">{a}</td>
                  <td className="py-1.5 text-center text-slate-500 dark:text-slate-400">=</td>
                  <td className="py-1.5 text-right">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">cm³ → dm³: ÷ 1000 · dm³ → cm³: × 1000</p>
        </section>

        <section className="sheet-card rounded-2xl border border-amber-300 bg-amber-50 p-5 print:break-inside-avoid dark:border-amber-800 dark:bg-amber-950/30">
          <h2 className="text-lg font-bold">⚠️ {f.remember}</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 marker:text-amber-600">
            {Object.values(f.rememberItems).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
