import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'

type Area = 'mass' | 'mole' | 'particles' | 'volume'

const boxColor: Record<Area, string> = {
  mass: 'bg-mass/15 border-mass text-teal-900 dark:text-teal-100',
  mole: 'bg-mole/15 border-mole text-orange-950 dark:text-orange-100',
  particles: 'bg-particles/15 border-particles text-lime-950 dark:text-lime-100',
  volume: 'bg-volume/15 border-volume text-yellow-950 dark:text-yellow-100',
}

/**
 * Interactive version of Rajah 3.9. Each outer box links to its calculator tab;
 * the arrows carry the operation needed to move between quantities.
 */
export default function RajahDiagram() {
  const { t } = useLanguage()

  const box = (area: Area, label: string, to: string) => (
    <Link
      to={to}
      style={{ gridArea: area } as CSSProperties}
      className={`flex min-h-16 items-center justify-center rounded-xl border-2 px-3 py-4 text-center font-semibold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 ${boxColor[area]} ${
        area === 'mole' ? 'text-lg sm:min-h-20' : ''
      }`}
    >
      {label}
    </Link>
  )

  return (
    <div className="rajah">
      {box('mass', t.quantity.mass, '/calculator?tab=mass')}
      {box('mole', t.quantity.mole, '/calculator')}
      {box('particles', t.quantity.particles, '/calculator?tab=particles')}
      {box('volume', t.quantity.volume, '/calculator?tab=volume')}

      {/* mass ↕ mole: always vertical */}
      <Ops area="a1" vertical first={['↑', t.op.timesMolarMass]} second={['↓', t.op.divMolarMass]} />
      {/* particles ⇄ mole */}
      <Ops area="a2" first={['←', t.op.timesNA, '↓']} second={['→', t.op.divNA, '↑']} />
      {/* mole ⇄ volume */}
      <Ops area="a3" first={['→', t.op.timesMolarVolume, '↓']} second={['←', t.op.divMolarVolume, '↑']} />
    </div>
  )
}

/** Renders "N_A" as N with a subscript A. */
function withSubscripts(text: string) {
  const [before, after] = text.split('N_A')
  if (after === undefined) return text
  return (
    <>
      {before}N<sub>A</sub>
      {after}
    </>
  )
}

/**
 * A pair of opposite arrows with their operations.
 * Each entry is [desktop arrow, label, phone arrow?]; phones stack the diagram,
 * so horizontal arrows become vertical ones there.
 */
function Ops({
  area,
  first,
  second,
  vertical = false,
}: {
  area: string
  first: [string, string, string?]
  second: [string, string, string?]
  vertical?: boolean
}) {
  const row = ([desk, label, phone]: [string, string, string?]) => (
    <div className="flex items-center justify-center gap-1.5 whitespace-nowrap">
      {vertical || !phone ? (
        <span aria-hidden>{desk}</span>
      ) : (
        <>
          <span aria-hidden className="sm:hidden">
            {phone}
          </span>
          <span aria-hidden className="hidden sm:inline">
            {desk}
          </span>
        </>
      )}
      <span>{withSubscripts(label)}</span>
    </div>
  )

  return (
    <div
      style={{ gridArea: area }}
      className="flex flex-col gap-1 text-xs font-medium text-slate-600 sm:text-sm dark:text-slate-300"
    >
      {row(first)}
      {row(second)}
    </div>
  )
}
