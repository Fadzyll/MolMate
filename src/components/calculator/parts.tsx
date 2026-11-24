import type { ReactNode } from 'react'
import { useLanguage } from '../../i18n/useLanguage'
import type { Condition } from '../../lib/mole'
import Segmented from '../ui/Segmented'

export type ParticleType = 'particles' | 'atoms' | 'molecules' | 'ions'

export interface WorkingStep {
  title: string
  content: ReactNode
}

/** Numbered list of working lines. */
export function WorkingSteps({ title, steps }: { title: string; steps: WorkingStep[] }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</h3>
      <ol className="space-y-3">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-3">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {i + 1}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{s.title}</p>
              <p className="mt-0.5 break-words">{s.content}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

export function FixedFactor({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-950">
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{title}</p>
      <p className="mt-0.5">{children}</p>
    </div>
  )
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{children}</h2>
  )
}

/** The highlighted answer box with a copy button. */
export function AnswerBox({
  title,
  children,
  extra,
  copyLabel,
  copiedLabel,
  copied,
  onCopy,
}: {
  title: string
  children: ReactNode
  extra?: ReactNode
  copyLabel: string
  copiedLabel: string
  copied: boolean
  onCopy: () => void
}) {
  return (
    <div className="rounded-xl bg-orange-50 p-4 dark:bg-orange-950/30">
      <p className="text-sm font-semibold uppercase tracking-wide text-orange-800 dark:text-orange-300">{title}</p>
      <p className="mt-1 text-2xl font-bold sm:text-3xl">{children}</p>
      {extra && <p className="mt-1 text-slate-600 dark:text-slate-300">{extra}</p>}
      <button
        type="button"
        onClick={onCopy}
        className="mt-3 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-800"
      >
        {copied ? `✓ ${copiedLabel}` : copyLabel}
      </button>
    </div>
  )
}

export function ParticleTypePicker({ value, onChange }: { value: ParticleType; onChange: (v: ParticleType) => void }) {
  const { t } = useLanguage()
  return (
    <Segmented<ParticleType>
      size="sm"
      label={t.calc.particleType}
      value={value}
      onChange={onChange}
      options={(['particles', 'atoms', 'molecules', 'ions'] as const).map((p) => ({ value: p, label: t.calc.particle[p] }))}
    />
  )
}

export function ExampleButtons({ onExample, onClear }: { onExample: () => void; onClear: () => void }) {
  const { t } = useLanguage()
  return (
    <div className="flex flex-wrap gap-2 pt-1">
      <button
        type="button"
        onClick={onExample}
        className="rounded-lg border border-teal-700 px-3 py-1.5 text-sm font-medium text-teal-800 hover:bg-teal-50 dark:border-teal-500 dark:text-teal-300 dark:hover:bg-teal-950"
      >
        {t.calc.example}
      </button>
      <button
        type="button"
        onClick={onClear}
        className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        {t.calc.clear}
      </button>
    </div>
  )
}

export function EmptyResult() {
  const { t } = useLanguage()
  return (
    <p className="grid h-full min-h-40 place-items-center text-center text-slate-500 dark:text-slate-400">{t.calc.empty}</p>
  )
}

export function ConditionPicker({
  title,
  value,
  onChange,
}: {
  title: ReactNode
  value: Condition
  onChange: (c: Condition) => void
}) {
  const { t } = useLanguage()
  return (
    <div>
      <p className="mb-1.5 text-sm font-medium">{title}</p>
      <Segmented<Condition>
        label={t.calc.condition}
        value={value}
        onChange={onChange}
        options={[
          { value: 'room', label: `${t.calc.room} · 24 dm³ mol⁻¹` },
          { value: 'stp', label: `${t.calc.stp} · 22.4 dm³ mol⁻¹` },
        ]}
      />
    </div>
  )
}
