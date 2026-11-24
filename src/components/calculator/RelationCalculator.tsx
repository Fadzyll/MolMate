import { useState, type ReactNode } from 'react'
import { useLanguage } from '../../i18n/useLanguage'
import { formatText, parseNumber } from '../../lib/format'
import { AVOGADRO, MOLAR_VOLUME, type Condition } from '../../lib/mole'
import { UNIT_LABELS, conversionFactor, convertUnit, type Dimension, type UnitOf } from '../../lib/units'
import { Num, Sym } from '../ui/Num'
import Segmented from '../ui/Segmented'
import { emptyField, fieldToString, type FieldValue } from './field'
import NumberField from './NumberField'
import { RELATIONS, type RelationId, type Unknown } from './relations'

type ParticleType = 'particles' | 'atoms' | 'molecules' | 'ions'

type Parsed = { ok: true; value: number } | { ok: false; error: 'invalid' | 'notPositive' | null }

function parse(field: FieldValue): Parsed {
  if (!field.text.trim() && !field.exponent.trim()) return { ok: false, error: null }
  const n = parseNumber(fieldToString(field))
  if (n === null) return { ok: false, error: 'invalid' }
  if (n <= 0) return { ok: false, error: 'notPositive' }
  return { ok: true, value: n }
}

const dimensionOf: Partial<Record<RelationId, Dimension>> = { mass: 'mass', volume: 'volume' }

export default function RelationCalculator({ id }: { id: RelationId }) {
  const { t } = useLanguage()
  const rel = RELATIONS[id]
  const dimension = dimensionOf[id]

  const [unknown, setUnknown] = useState<Unknown>('n')
  const [n, setN] = useState<FieldValue>(emptyField)
  const [x, setX] = useState<FieldValue>(emptyField)
  const [f, setF] = useState<FieldValue>(emptyField)
  const [xUnit, setXUnit] = useState<string>(rel.xUnits[0] ?? '')
  const [particleType, setParticleType] = useState<ParticleType>('particles')
  const [condition, setCondition] = useState<Condition>('room')
  const [copied, setCopied] = useState(false)

  const label = (key: keyof typeof t.calc.vars) => t.calc.vars[key]
  const xName = label(rel.xLabel)
  const fName = label(rel.fLabel)
  const baseUnit = rel.xUnits[0] ?? ''

  // ----- inputs → numbers -----
  const pn = parse(n)
  const px = parse(x)
  const pf = parse(f)

  const xBase = px.ok && dimension ? convertUnit(dimension, px.value, xUnit as never, baseUnit as never) : px.ok ? px.value : null

  const factor: number | null =
    rel.fMode === 'constant' ? AVOGADRO : rel.fMode === 'condition' ? MOLAR_VOLUME[condition] : pf.ok ? pf.value : null

  let result: number | null = null
  if (unknown === 'n' && xBase !== null && factor !== null) result = rel.solve.n(xBase, factor)
  if (unknown === 'x' && pn.ok && factor !== null) result = rel.solve.x(pn.value, factor)
  if (unknown === 'f' && xBase !== null && pn.ok && rel.solve.f) result = rel.solve.f(xBase, pn.value)

  // ----- units for display -----
  const particleWord = t.calc.particle[particleType]
  const xUnitText = id === 'particles' ? particleWord : UNIT_LABELS[baseUnit]
  const unitOf: Record<Unknown, string> = { n: 'mol', x: xUnitText, f: rel.fUnit }

  // ----- actions -----
  const clear = () => {
    setN(emptyField)
    setX(emptyField)
    setF(emptyField)
    setCopied(false)
  }

  const changeUnknown = (u: Unknown) => {
    setUnknown(u)
    clear()
  }

  const loadExample = () => {
    const ex = rel.examples[unknown] ?? {}
    setN({ text: ex.n ?? '', exponent: '' })
    setX({ text: ex.x ?? '', exponent: ex.xExponent ?? '' })
    setF({ text: ex.f ?? '', exponent: '' })
    if (ex.xUnit) setXUnit(ex.xUnit)
    setCopied(false)
  }

  const copy = async () => {
    if (result === null) return
    const sym = { n: 'n', x: rel.xSymbol, f: rel.fSymbol.replace('_', '') }[unknown]
    try {
      await navigator.clipboard.writeText(`${sym} = ${formatText(result)} ${unitOf[unknown]}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard blocked; nothing else to do.
    }
  }

  const err = (p: Parsed) => (!p.ok && p.error ? t.calc.errors[p.error] : null)

  // ----- fields -----
  const nField = (
    <NumberField
      label={label('n')}
      symbol={<Sym s="n" />}
      value={n}
      onChange={setN}
      error={err(pn)}
      unitSuffix="mol"
      placeholder="0.5"
    />
  )

  const xField = (
    <NumberField
      label={xName}
      symbol={<Sym s={rel.xSymbol} />}
      value={x}
      onChange={setX}
      error={err(px)}
      scientific={id === 'particles'}
      units={rel.xUnits}
      unit={xUnit}
      onUnitChange={setXUnit}
      unitSuffix={id === 'particles' ? undefined : UNIT_LABELS[baseUnit]}
      placeholder={id === 'particles' ? '6.02' : '10'}
    />
  )

  const fField =
    rel.fMode === 'input' ? (
      <NumberField
        label={fName}
        symbol={<Sym s={rel.fSymbol} />}
        value={f}
        onChange={setF}
        error={err(pf)}
        unitSuffix={rel.fUnit}
        placeholder="44"
      />
    ) : rel.fMode === 'constant' ? (
      <FixedFactor title={`${fName} (${t.calc.constant})`}>
        <Sym s={rel.fSymbol} /> = <Num value={AVOGADRO} /> {rel.fUnit}
      </FixedFactor>
    ) : (
      <div>
        <p className="mb-1.5 text-sm font-medium">
          {fName} (<Sym s={rel.fSymbol} />)
        </p>
        <Segmented<Condition>
          label={t.calc.condition}
          value={condition}
          onChange={setCondition}
          options={[
            { value: 'room', label: `${t.calc.room} · 24 dm³ mol⁻¹` },
            { value: 'stp', label: `${t.calc.stp} · 22.4 dm³ mol⁻¹` },
          ]}
        />
      </div>
    )

  const givenFields: Record<Unknown, ReactNode[]> = {
    n: [xField, fField],
    x: [nField, fField],
    f: [xField, nField],
  }

  const solveOptions = rel.canSolve.map((u) => ({
    value: u,
    label: (
      <>
        {u === 'n' ? label('n') : u === 'x' ? xName : fName} (
        <Sym s={u === 'n' ? 'n' : u === 'x' ? rel.xSymbol : rel.fSymbol} />)
      </>
    ),
  }))

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ----- input card ----- */}
      <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {t.calc.find}
          </h2>
          <Segmented<Unknown> label={t.calc.find} value={unknown} onChange={changeUnknown} options={solveOptions} />
        </div>

        {id === 'particles' && (
          <div>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {t.calc.particleType}
            </h2>
            <Segmented<ParticleType>
              size="sm"
              label={t.calc.particleType}
              value={particleType}
              onChange={setParticleType}
              options={(['particles', 'atoms', 'molecules', 'ions'] as const).map((p) => ({
                value: p,
                label: t.calc.particle[p],
              }))}
            />
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {t.calc.given}
          </h2>
          {givenFields[unknown].map((field, i) => (
            <div key={`${unknown}-${i}`}>{field}</div>
          ))}
          {id === 'particles' && unknown === 'n' && (
            <p className="text-xs text-slate-500 dark:text-slate-400">{t.calc.sciTip}</p>
          )}
          {id === 'volume' && <p className="text-xs text-slate-500 dark:text-slate-400">{t.calc.gasOnly}</p>}
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={loadExample}
            className="rounded-lg border border-teal-700 px-3 py-1.5 text-sm font-medium text-teal-800 hover:bg-teal-50 dark:border-teal-500 dark:text-teal-300 dark:hover:bg-teal-950"
          >
            {t.calc.example}
          </button>
          <button
            type="button"
            onClick={clear}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {t.calc.clear}
          </button>
        </div>
      </section>

      {/* ----- answer + working ----- */}
      <section
        aria-live="polite"
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        {result === null ? (
          <p className="grid h-full min-h-40 place-items-center text-center text-slate-500 dark:text-slate-400">
            {t.calc.empty}
          </p>
        ) : (
          renderWorking({
            unknown,
            result,
            n: pn.ok ? pn.value : null,
            xRaw: px.ok ? px.value : null,
            xBase,
            xUnit,
            factor,
            dimension,
            unitOf,
            copied,
            onCopy: copy,
          })
        )}
      </section>
    </div>
  )

  // A render helper (not a component) so it can see `rel`, `t` and the unit helpers.
  function renderWorking({
    unknown,
    result,
    n,
    xRaw,
    xBase,
    xUnit,
    factor,
    dimension,
    unitOf,
    copied,
    onCopy,
  }: {
    unknown: Unknown
    result: number
    n: number | null
    xRaw: number | null
    xBase: number | null
    xUnit: string
    factor: number | null
    dimension: Dimension | undefined
    unitOf: Record<Unknown, string>
    copied: boolean
    onCopy: () => void
  }) {
    const S = (s: string) => <Sym s={s} />
    const sym = { n: 'n', x: rel.xSymbol, f: rel.fSymbol }
    const q = (v: number, unit: string) => (
      <>
        <Num value={v} sigFigs={6} /> {unit}
      </>
    )

    const needsConversion = unknown !== 'x' && dimension && xRaw !== null && xUnit !== baseUnit
    const conv = needsConversion
      ? conversionFactor(dimension, xUnit as UnitOf<Dimension>, baseUnit as UnitOf<Dimension>)
      : null

    let formula: ReactNode
    let substitution: ReactNode
    if (unknown === 'n') {
      formula = <>{S('n')} = {S(rel.xSymbol)} ÷ {S(rel.fSymbol)}</>
      substitution = <>{q(xBase!, unitOf.x)} ÷ {q(factor!, rel.fUnit)}</>
    } else if (unknown === 'x') {
      formula = <>{S(rel.xSymbol)} = {S('n')} × {S(rel.fSymbol)}</>
      substitution = <>{q(n!, 'mol')} × {q(factor!, rel.fUnit)}</>
    } else {
      formula = <>{S(rel.fSymbol)} = {S(rel.xSymbol)} ÷ {S('n')}</>
      substitution = <>{q(xBase!, unitOf.x)} ÷ {q(n!, 'mol')}</>
    }

    // Volumes in dm³ are also shown in cm³, since questions use both.
    const alsoCm3 = id === 'volume' && unknown === 'x' ? convertUnit('volume', result, 'dm3', 'cm3') : null

    return (
      <div className="space-y-5">
        <div className="rounded-xl bg-orange-50 p-4 dark:bg-orange-950/30">
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-800 dark:text-orange-300">
            {t.calc.answer}
          </p>
          <p className="mt-1 text-2xl font-bold sm:text-3xl">
            {S(sym[unknown])} = <Num value={result} /> <span className="text-xl font-semibold">{unitOf[unknown]}</span>
          </p>
          {alsoCm3 !== null && (
            <p className="mt-1 text-slate-600 dark:text-slate-300">
              = <Num value={alsoCm3} /> cm³
            </p>
          )}
          <button
            type="button"
            onClick={onCopy}
            className="mt-3 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-800"
          >
            {copied ? `✓ ${t.calc.copied}` : t.calc.copy}
          </button>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {t.calc.working}
          </h3>
          <ol className="space-y-3">
            {needsConversion && conv && (
              <Line n={1} title={t.calc.convertUnits}>
                {S(rel.xSymbol)} = {q(xRaw!, UNIT_LABELS[xUnit])} {conv.op === 'divide' ? '÷' : '×'} {conv.value} ={' '}
                {q(xBase!, UNIT_LABELS[baseUnit])}
              </Line>
            )}
            <Line n={needsConversion ? 2 : 1} title={t.calc.formula}>
              {formula}
            </Line>
            <Line n={needsConversion ? 3 : 2} title={t.calc.substitute}>
              {S(sym[unknown])} = {substitution}
            </Line>
            <Line n={needsConversion ? 4 : 3} title={t.calc.answer}>
              <strong>
                {S(sym[unknown])} = <Num value={result} /> {unitOf[unknown]}
              </strong>
            </Line>
          </ol>
        </div>
      </div>
    )
  }
}

function Line({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        {n}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <p className="mt-0.5 break-words">{children}</p>
      </div>
    </li>
  )
}

function FixedFactor({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-950">
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{title}</p>
      <p className="mt-0.5">{children}</p>
    </div>
  )
}
