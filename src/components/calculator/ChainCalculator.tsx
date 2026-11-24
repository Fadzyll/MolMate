import { Fragment, useState, type ReactNode } from 'react'
import { useLanguage } from '../../i18n/useLanguage'
import { formatText } from '../../lib/format'
import { breakdownText, tryParseFormula } from '../../lib/formula'
import { MOLAR_VOLUME, convert, type Condition, type Quantity, type Step } from '../../lib/mole'
import { UNIT_LABELS, conversionFactor, convertUnit, type Dimension, type UnitOf } from '../../lib/units'
import { Formula } from '../ui/Formula'
import { Num, Sym } from '../ui/Num'
import Segmented from '../ui/Segmented'
import { emptyField, parseField, type FieldValue } from './field'
import { cardClass, copyText } from './helpers'
import MolarMassHelper from './MolarMassHelper'
import NumberField from './NumberField'
import {
  AnswerBox,
  ConditionPicker,
  EmptyResult,
  ExampleButtons,
  ParticleTypePicker,
  SectionLabel,
  WorkingSteps,
  type ParticleType,
  type WorkingStep,
} from './parts'

type MolarMassMode = 'enter' | 'formula'

const QUANTITIES: Quantity[] = ['mass', 'particles', 'mole', 'volume']

const META: Record<Quantity, { symbol: string; units: readonly string[]; dimension?: Dimension; dot: string }> = {
  mole: { symbol: 'n', units: ['mol'], dot: 'bg-mole' },
  particles: { symbol: 'N', units: [], dot: 'bg-particles' },
  mass: { symbol: 'm', units: ['g', 'kg', 'mg'], dimension: 'mass', dot: 'bg-mass' },
  volume: { symbol: 'V', units: ['dm3', 'cm3'], dimension: 'volume', dot: 'bg-volume' },
}

const FACTOR_SYMBOL: Record<Step['factor'], string> = { avogadro: 'N_A', molarMass: 'M', molarVolume: 'V_m' }
const FACTOR_UNIT: Record<Step['factor'], string> = {
  avogadro: 'mol⁻¹',
  molarMass: 'g mol⁻¹',
  molarVolume: 'dm³ mol⁻¹',
}

/** Textbook-style examples for some routes (Contoh 12/13 style). */
const EXAMPLES: Partial<Record<`${Quantity}-${Quantity}`, { value: string; exponent?: string; unit?: string; formula?: string }>> = {
  'mass-particles': { value: '3.2', unit: 'g', formula: 'O2' },
  'particles-mass': { value: '1.204', exponent: '23', formula: 'H2O' },
  'volume-mass': { value: '6', unit: 'dm3', formula: 'CO2' },
  'mass-volume': { value: '8.8', unit: 'g', formula: 'CO2' },
  'volume-particles': { value: '480', unit: 'cm3' },
  'particles-volume': { value: '3.01', exponent: '22' },
}

export default function ChainCalculator() {
  const { t } = useLanguage()
  const [from, setFrom] = useState<Quantity>('mass')
  const [to, setTo] = useState<Quantity>('particles')
  const [value, setValue] = useState<FieldValue>(emptyField)
  const [unit, setUnit] = useState('g')
  const [mMode, setMMode] = useState<MolarMassMode>('formula')
  const [formula, setFormula] = useState('')
  const [mField, setMField] = useState<FieldValue>(emptyField)
  const [condition, setCondition] = useState<Condition>('room')
  const [particleType, setParticleType] = useState<ParticleType>('particles')
  const [copied, setCopied] = useState(false)

  const qLabel = (q: Quantity) => t.quantity[q].replace(' (g)', '')
  const needsMass = from === 'mass' || to === 'mass'
  const needsVolume = from === 'volume' || to === 'volume'
  const needsParticles = from === 'particles' || to === 'particles'
  const fromMeta = META[from]

  // ----- choosing the route -----
  const chooseFrom = (q: Quantity) => {
    if (q === to) setTo(from) // keep the two ends different by swapping
    setFrom(q)
    setUnit(META[q].units[0] ?? '')
    setValue(emptyField)
    setCopied(false)
  }
  const chooseTo = (q: Quantity) => {
    if (q === from) chooseFrom(to)
    setTo(q)
    setCopied(false)
  }
  const swap = () => {
    setFrom(to)
    setTo(from)
    setUnit(META[to].units[0] ?? '')
    setValue(emptyField)
    setCopied(false)
  }

  // ----- inputs → numbers -----
  const pv = parseField(value)
  const baseUnit = fromMeta.units[0] ?? ''
  const valueBase = pv.ok
    ? fromMeta.dimension
      ? convertUnit(fromMeta.dimension, pv.value, unit as never, baseUnit as never)
      : pv.value
    : null

  const formulaParse = needsMass && mMode === 'formula' && formula.trim() ? tryParseFormula(formula) : null
  const formulaResult = formulaParse?.ok ? formulaParse.result : null
  const pm = parseField(mField)
  const molarMass = !needsMass ? undefined : mMode === 'formula' ? formulaResult?.total : pm.ok ? pm.value : undefined

  const ready = valueBase !== null && (!needsMass || molarMass !== undefined)
  const chain = ready ? convert(from, to, valueBase, { molarMass, molarVolume: MOLAR_VOLUME[condition] }) : null

  const unitText = (q: Quantity) =>
    q === 'mole' ? 'mol' : q === 'particles' ? t.calc.particle[particleType] : UNIT_LABELS[META[q].units[0]]

  // ----- actions -----
  const clear = () => {
    setValue(emptyField)
    setFormula('')
    setMField(emptyField)
    setCopied(false)
  }
  const loadExample = () => {
    const ex = EXAMPLES[`${from}-${to}`] ?? { value: from === 'particles' ? '6.02' : '0.5', exponent: from === 'particles' ? '23' : undefined }
    setValue({ text: ex.value, exponent: ex.exponent ?? '' })
    if (ex.unit) setUnit(ex.unit)
    setFormula(ex.formula ?? (needsMass ? 'H2O' : ''))
    setMMode('formula')
    setCopied(false)
  }
  const copy = () => {
    if (!chain) return
    copyText(`${META[to].symbol} = ${formatText(chain.value)} ${unitText(to)}`, setCopied)
  }

  // ----- working -----
  const steps: WorkingStep[] = []
  if (chain) {
    const S = (s: string) => <Sym s={s} />
    const q = (v: number, u: string) => (
      <>
        <Num value={v} sigFigs={6} /> {u}
      </>
    )

    if (fromMeta.dimension && pv.ok && unit !== baseUnit) {
      const conv = conversionFactor(fromMeta.dimension, unit as UnitOf<Dimension>, baseUnit as UnitOf<Dimension>)!
      steps.push({
        title: t.calc.convertUnits,
        content: (
          <>
            {S(fromMeta.symbol)} = {q(pv.value, UNIT_LABELS[unit])} {conv.op === 'divide' ? '÷' : '×'} {conv.value} ={' '}
            {q(valueBase!, UNIT_LABELS[baseUnit])}
          </>
        ),
      })
    }

    if (formulaResult) {
      steps.push({
        title: t.calc.molarMass.stepTitle,
        content: (
          <>
            {S('M')}(<Formula text={formulaResult.formula} />) = {breakdownText(formulaResult)} g mol⁻¹
          </>
        ),
      })
    }

    for (const s of chain.steps) {
      const toSym = META[s.to].symbol
      const fromSym = META[s.from].symbol
      const op = s.op === 'divide' ? '÷' : '×'
      steps.push({
        title: s.to === 'mole' ? t.calc.chain.toMoles : t.calc.chain.fromMoles,
        content: (
          <>
            {S(toSym)} = {S(fromSym)} {op} {S(FACTOR_SYMBOL[s.factor])}
            <br />= {q(s.input, unitText(s.from))} {op} {q(s.factorValue, FACTOR_UNIT[s.factor])}
            <br />= <strong>{q(s.output, unitText(s.to))}</strong>
          </>
        ),
      })
    }
  }

  const alsoCm3 = chain && to === 'volume' ? convertUnit('volume', chain.value, 'dm3', 'cm3') : null

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <section className={`${cardClass} space-y-5`}>
        <p className="text-sm text-slate-600 dark:text-slate-400">{t.calc.chain.intro}</p>

        <div className="space-y-3">
          <div>
            <SectionLabel>{t.calc.chain.from}</SectionLabel>
            <QuantityPicker label={t.calc.chain.from} value={from} onChange={chooseFrom} qLabel={qLabel} />
          </div>
          <button
            type="button"
            onClick={swap}
            className="rounded-lg px-2 py-1 text-sm font-medium text-teal-800 hover:bg-teal-50 dark:text-teal-300 dark:hover:bg-teal-950"
          >
            ⇅ {t.calc.chain.swap}
          </button>
          <div>
            <SectionLabel>{t.calc.chain.to}</SectionLabel>
            <QuantityPicker label={t.calc.chain.to} value={to} onChange={chooseTo} qLabel={qLabel} disabled={from} />
          </div>
        </div>

        <Route from={from} to={to} qLabel={qLabel} title={t.calc.chain.route} />

        {needsParticles && (
          <div>
            <SectionLabel>{t.calc.particleType}</SectionLabel>
            <ParticleTypePicker value={particleType} onChange={setParticleType} />
          </div>
        )}

        <div className="space-y-4">
          <SectionLabel>{t.calc.given}</SectionLabel>
          <NumberField
            label={qLabel(from)}
            symbol={<Sym s={fromMeta.symbol} />}
            value={value}
            onChange={setValue}
            error={!pv.ok && pv.error ? t.calc.errors[pv.error] : null}
            scientific={from === 'particles'}
            units={fromMeta.units}
            unit={unit}
            onUnitChange={setUnit}
            unitSuffix={from === 'mole' ? 'mol' : undefined}
            placeholder={from === 'particles' ? '6.02' : '10'}
          />

          {needsMass && (
            <div className="space-y-2 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium">
                  {t.calc.vars.M} (<Sym s="M" />)
                </p>
                <Segmented<MolarMassMode>
                  size="sm"
                  label={t.calc.molarMass.mode}
                  value={mMode}
                  onChange={setMMode}
                  options={[
                    { value: 'formula', label: t.calc.molarMass.fromFormula },
                    { value: 'enter', label: t.calc.molarMass.enter },
                  ]}
                />
              </div>
              {mMode === 'formula' ? (
                <MolarMassHelper value={formula} onChange={setFormula} />
              ) : (
                <NumberField
                  label={t.calc.vars.M}
                  symbol={<Sym s="M" />}
                  value={mField}
                  onChange={setMField}
                  error={!pm.ok && pm.error ? t.calc.errors[pm.error] : null}
                  unitSuffix="g mol⁻¹"
                  placeholder="44"
                />
              )}
            </div>
          )}

          {needsVolume && (
            <ConditionPicker
              title={
                <>
                  {t.calc.vars.Vm} (<Sym s="V_m" />)
                </>
              }
              value={condition}
              onChange={setCondition}
            />
          )}
        </div>

        <ExampleButtons onExample={loadExample} onClear={clear} />
      </section>

      <section aria-live="polite" className={cardClass}>
        {!chain ? (
          <EmptyResult />
        ) : (
          <div className="space-y-5">
            <AnswerBox
              title={t.calc.answer}
              copyLabel={t.calc.copy}
              copiedLabel={t.calc.copied}
              copied={copied}
              onCopy={copy}
              extra={
                alsoCm3 !== null && (
                  <>
                    = <Num value={alsoCm3} /> cm³
                  </>
                )
              }
            >
              <Sym s={META[to].symbol} /> = <Num value={chain.value} />{' '}
              <span className="text-xl font-semibold">{unitText(to)}</span>
            </AnswerBox>
            <WorkingSteps title={t.calc.working} steps={steps} />
          </div>
        )}
      </section>
    </div>
  )
}

function QuantityPicker({
  label,
  value,
  onChange,
  qLabel,
  disabled,
}: {
  label: string
  value: Quantity
  onChange: (q: Quantity) => void
  qLabel: (q: Quantity) => string
  disabled?: Quantity
}) {
  return (
    <Segmented<Quantity>
      label={label}
      value={value}
      onChange={onChange}
      options={QUANTITIES.filter((q) => q !== disabled).map((q) => ({
        value: q,
        label: (
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden className={`h-2 w-2 rounded-full ${META[q].dot}`} />
            {qLabel(q)}
          </span>
        ),
      }))}
    />
  )
}

/** The path through Rajah 3.9, e.g. Mass → Number of moles → Number of particles. */
function Route({
  from,
  to,
  qLabel,
  title,
}: {
  from: Quantity
  to: Quantity
  qLabel: (q: Quantity) => string
  title: string
}) {
  const path: Quantity[] = from === 'mole' || to === 'mole' ? [from, to] : [from, 'mole', to]
  const chip = (q: Quantity): ReactNode => (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium dark:bg-slate-800">
      <span aria-hidden className={`h-2 w-2 rounded-full ${META[q].dot}`} />
      {qLabel(q)}
    </span>
  )
  return (
    <div>
      <SectionLabel>{title}</SectionLabel>
      <div className="flex flex-wrap items-center gap-1.5">
        {path.map((q, i) => (
          <Fragment key={q}>
            {i > 0 && (
              <span aria-hidden className="text-slate-400">
                →
              </span>
            )}
            {chip(q)}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
