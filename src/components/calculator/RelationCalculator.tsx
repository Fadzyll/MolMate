import { useState, type ReactNode } from 'react'
import { useLanguage } from '../../i18n/useLanguage'
import { formatText } from '../../lib/format'
import { breakdownText, tryParseFormula } from '../../lib/formula'
import { AVOGADRO, MOLAR_VOLUME, type Condition } from '../../lib/mole'
import { UNIT_LABELS, conversionFactor, convertUnit, type Dimension, type UnitOf } from '../../lib/units'
import { Formula } from '../ui/Formula'
import { Num, Sym } from '../ui/Num'
import Segmented from '../ui/Segmented'
import { emptyField, parseField, type FieldValue, type Parsed } from './field'
import { cardClass, copyText } from './helpers'
import MolarMassHelper from './MolarMassHelper'
import NumberField from './NumberField'
import {
  AnswerBox,
  ConditionPicker,
  EmptyResult,
  ExampleButtons,
  FixedFactor,
  ParticleTypePicker,
  SectionLabel,
  WorkingSteps,
  type ParticleType,
  type WorkingStep,
} from './parts'
import { RELATIONS, type RelationId, type Unknown } from './relations'

type MolarMassMode = 'enter' | 'formula'

const dimensionOf: Partial<Record<RelationId, Dimension>> = { mass: 'mass', volume: 'volume' }

export default function RelationCalculator({ id, initialFormula = '' }: { id: RelationId; initialFormula?: string }) {
  const { t } = useLanguage()
  const rel = RELATIONS[id]
  const dimension = dimensionOf[id]
  const baseUnit = rel.xUnits[0] ?? ''

  const [unknown, setUnknown] = useState<Unknown>('n')
  const [n, setN] = useState<FieldValue>(emptyField)
  const [x, setX] = useState<FieldValue>(emptyField)
  const [f, setF] = useState<FieldValue>(emptyField)
  const [xUnit, setXUnit] = useState<string>(baseUnit)
  const [particleType, setParticleType] = useState<ParticleType>('particles')
  const [condition, setCondition] = useState<Condition>('room')
  const [mMode, setMMode] = useState<MolarMassMode>(initialFormula ? 'formula' : 'enter')
  const [formula, setFormula] = useState(initialFormula)
  const [copied, setCopied] = useState(false)

  const label = (key: keyof typeof t.calc.vars) => t.calc.vars[key]
  const xName = label(rel.xLabel)
  const fName = label(rel.fLabel)

  // ----- inputs → numbers -----
  const pn = parseField(n)
  const px = parseField(x)
  const pf = parseField(f)

  const xBase = px.ok ? (dimension ? convertUnit(dimension, px.value, xUnit as never, baseUnit as never) : px.value) : null

  const usingFormula = rel.fMode === 'input' && unknown !== 'f' && mMode === 'formula'
  const formulaParse = usingFormula && formula.trim() ? tryParseFormula(formula) : null
  const formulaResult = formulaParse?.ok ? formulaParse.result : null

  let factor: number | null = null
  if (rel.fMode === 'constant') factor = AVOGADRO
  else if (rel.fMode === 'condition') factor = MOLAR_VOLUME[condition]
  else if (usingFormula) factor = formulaResult?.total ?? null
  else if (pf.ok) factor = pf.value

  let result: number | null = null
  if (unknown === 'n' && xBase !== null && factor !== null) result = rel.solve.n(xBase, factor)
  if (unknown === 'x' && pn.ok && factor !== null) result = rel.solve.x(pn.value, factor)
  if (unknown === 'f' && xBase !== null && pn.ok && rel.solve.f) result = rel.solve.f(xBase, pn.value)

  // ----- units for display -----
  const xUnitText = id === 'particles' ? t.calc.particle[particleType] : UNIT_LABELS[baseUnit]
  const unitOf: Record<Unknown, string> = { n: 'mol', x: xUnitText, f: rel.fUnit }
  const sym: Record<Unknown, string> = { n: 'n', x: rel.xSymbol, f: rel.fSymbol }

  // ----- actions -----
  const clear = () => {
    setN(emptyField)
    setX(emptyField)
    setF(emptyField)
    setFormula('')
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
    setFormula(ex.formula ?? '')
    if (ex.xUnit) setXUnit(ex.xUnit)
    setCopied(false)
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

  let fField: ReactNode
  if (rel.fMode === 'constant') {
    fField = (
      <FixedFactor title={`${fName} (${t.calc.constant})`}>
        <Sym s={rel.fSymbol} /> = <Num value={AVOGADRO} /> {rel.fUnit}
      </FixedFactor>
    )
  } else if (rel.fMode === 'condition') {
    fField = <ConditionPicker title={<>{fName} (<Sym s={rel.fSymbol} />)</>} value={condition} onChange={setCondition} />
  } else {
    fField = (
      <div className="space-y-2 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium">
            {fName} (<Sym s={rel.fSymbol} />)
          </p>
          <Segmented<MolarMassMode>
            size="sm"
            label={t.calc.molarMass.mode}
            value={mMode}
            onChange={setMMode}
            options={[
              { value: 'enter', label: t.calc.molarMass.enter },
              { value: 'formula', label: t.calc.molarMass.fromFormula },
            ]}
          />
        </div>
        {mMode === 'formula' ? (
          <MolarMassHelper value={formula} onChange={setFormula} />
        ) : (
          <NumberField
            label={fName}
            symbol={<Sym s={rel.fSymbol} />}
            value={f}
            onChange={setF}
            error={err(pf)}
            unitSuffix={rel.fUnit}
            placeholder="44"
          />
        )}
      </div>
    )
  }

  const givenFields: Record<Unknown, ReactNode[]> = {
    n: [xField, fField],
    x: [nField, fField],
    f: [xField, nField],
  }

  const solveOptions = rel.canSolve.map((u) => ({
    value: u,
    label: (
      <>
        {u === 'n' ? label('n') : u === 'x' ? xName : fName} (<Sym s={sym[u]} />)
      </>
    ),
  }))

  // ----- working -----
  const steps: WorkingStep[] = []
  if (result !== null) {
    const S = (s: string) => <Sym s={s} />
    const q = (v: number, unit: string) => (
      <>
        <Num value={v} sigFigs={6} /> {unit}
      </>
    )
    const nValue = pn.ok ? pn.value : 0

    if (unknown !== 'x' && dimension && px.ok && xUnit !== baseUnit) {
      const conv = conversionFactor(dimension, xUnit as UnitOf<Dimension>, baseUnit as UnitOf<Dimension>)!
      steps.push({
        title: t.calc.convertUnits,
        content: (
          <>
            {S(rel.xSymbol)} = {q(px.value, UNIT_LABELS[xUnit])} {conv.op === 'divide' ? '÷' : '×'} {conv.value} ={' '}
            {q(xBase!, UNIT_LABELS[baseUnit])}
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

    let formulaLine: ReactNode
    let substitution: ReactNode
    if (unknown === 'n') {
      formulaLine = <>{S('n')} = {S(rel.xSymbol)} ÷ {S(rel.fSymbol)}</>
      substitution = <>{q(xBase!, unitOf.x)} ÷ {q(factor!, rel.fUnit)}</>
    } else if (unknown === 'x') {
      formulaLine = <>{S(rel.xSymbol)} = {S('n')} × {S(rel.fSymbol)}</>
      substitution = <>{q(nValue, 'mol')} × {q(factor!, rel.fUnit)}</>
    } else {
      formulaLine = <>{S(rel.fSymbol)} = {S(rel.xSymbol)} ÷ {S('n')}</>
      substitution = <>{q(xBase!, unitOf.x)} ÷ {q(nValue, 'mol')}</>
    }

    steps.push({ title: t.calc.formula, content: formulaLine })
    steps.push({ title: t.calc.substitute, content: <>{S(sym[unknown])} = {substitution}</> })
    steps.push({
      title: t.calc.answer,
      content: (
        <strong>
          {S(sym[unknown])} = <Num value={result} /> {unitOf[unknown]}
        </strong>
      ),
    })
  }

  // Volumes in dm³ are also shown in cm³, since questions use both.
  const alsoCm3 = result !== null && id === 'volume' && unknown === 'x' ? convertUnit('volume', result, 'dm3', 'cm3') : null

  const copy = () => {
    if (result === null) return
    copyText(`${sym[unknown].replace('_', '')} = ${formatText(result)} ${unitOf[unknown]}`, setCopied)
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <section className={`${cardClass} space-y-5`}>
        <div>
          <SectionLabel>{t.calc.find}</SectionLabel>
          <Segmented<Unknown> label={t.calc.find} value={unknown} onChange={changeUnknown} options={solveOptions} />
        </div>

        {id === 'particles' && (
          <div>
            <SectionLabel>{t.calc.particleType}</SectionLabel>
            <ParticleTypePicker value={particleType} onChange={setParticleType} />
          </div>
        )}

        <div className="space-y-4">
          <SectionLabel>{t.calc.given}</SectionLabel>
          {givenFields[unknown].map((field, i) => (
            <div key={`${unknown}-${i}`}>{field}</div>
          ))}
          {id === 'particles' && unknown === 'n' && (
            <p className="text-xs text-slate-500 dark:text-slate-400">{t.calc.sciTip}</p>
          )}
          {id === 'volume' && <p className="text-xs text-slate-500 dark:text-slate-400">{t.calc.gasOnly}</p>}
        </div>

        <ExampleButtons onExample={loadExample} onClear={clear} />
      </section>

      <section aria-live="polite" className={cardClass}>
        {result === null ? (
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
              <Sym s={sym[unknown]} /> = <Num value={result} />{' '}
              <span className="text-xl font-semibold">{unitOf[unknown]}</span>
            </AnswerBox>
            <WorkingSteps title={t.calc.working} steps={steps} />
          </div>
        )}
      </section>
    </div>
  )
}
