import { useEffect, useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { neutronCount, shellCounts, type Element } from '../../data/elements'
import { useLanguage } from '../../i18n/useLanguage'
import AtomModel from './AtomModel'
import { CATEGORY_STYLE, jarText } from './categories'

/**
 * Element details in a native modal dialog (Escape and backdrop click close it).
 * The 3D atom sits on top; the facts follow when you scroll.
 */
export default function ElementDialog({ element, onClose }: { element: Element | null; onClose: () => void }) {
  const { t, lang } = useLanguage()
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (element && !dialog.open) {
      dialog.showModal()
      dialog.scrollTop = 0
    }
    if (!element && dialog.open) dialog.close()
  }, [element])

  const d = t.pt.detail
  const e = element

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(ev) => {
        if (ev.target === ref.current) onClose()
      }}
      aria-labelledby="element-dialog-title"
      className="no-scrollbar m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto overscroll-contain rounded-2xl bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/70 backdrop:backdrop-blur-sm md:max-w-5xl md:overflow-hidden dark:bg-slate-900 dark:text-slate-100"
    >
      {e && (
        <div className="md:grid md:max-h-[calc(100dvh-2rem)] md:grid-cols-[1.15fr_1fr]">
          <AtomPanel element={e} />

          <button
            type="button"
            onClick={onClose}
            aria-label={d.close}
            className="absolute top-3 right-3 z-20 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 md:bg-slate-100 md:text-slate-600 md:hover:bg-slate-200 dark:md:bg-slate-800 dark:md:text-slate-300 dark:md:hover:bg-slate-700"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>

          <div className="no-scrollbar p-5 sm:p-6 md:overflow-y-auto md:p-8 md:pt-10">
            <div className="flex items-start gap-4">
              <div
                className={`grid h-16 w-16 shrink-0 place-items-center rounded-xl border-2 ${CATEGORY_STYLE[e.category].tile}`}
              >
                <div className="text-center leading-none">
                  <div className="text-xs font-medium opacity-75">{e.z}</div>
                  <div className="mt-1 text-2xl font-bold">{e.symbol}</div>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h2 id="element-dialog-title" className="text-2xl font-bold">
                  {lang === 'ms' ? e.nameMs : e.nameEn}
                </h2>
                <p className="text-slate-500 dark:text-slate-400">{lang === 'ms' ? e.nameEn : e.nameMs}</p>
                <p className="mt-1 inline-flex items-center gap-1.5 text-sm">
                  <span aria-hidden className={`h-2.5 w-2.5 rounded-full ${CATEGORY_STYLE[e.category].dot}`} />
                  {t.pt.categories[e.category]}
                </p>
              </div>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-3">
              <Fact label={d.protonNumber} value={e.z} />
              <Fact label={d.electrons} value={e.electrons} />
              <Fact label={d.jar} value={jarText(e)} />
              <Fact label={d.molarMass} value={`${e.jar} g mol⁻¹`} />
              <Fact label={d.group} value={e.group ?? d.fBlock} />
              <Fact label={d.period} value={e.period} />
              <Fact
                className="col-span-2"
                label={d.arrangement}
                value={e.electronArrangement ?? '—'}
                note={e.electronArrangement ? undefined : d.arrangementNote}
              />
            </dl>

            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">{d.electronsNote}</p>
            {e.radioactive && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{d.radioactive}</p>}

            <Link
              to={`/calculator?tab=mass&formula=${encodeURIComponent(e.symbol)}`}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 font-semibold text-white hover:bg-teal-800"
            >
              {d.useInCalculator} <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      )}
    </dialog>
  )
}

function AtomPanel({ element: e }: { element: Element }) {
  const { t, lang } = useLanguage()
  const a = t.atom
  const shells = shellCounts(e.z)
  const neutrons = neutronCount(e)
  const label = a.label
    .replace('{name}', lang === 'ms' ? e.nameMs : e.nameEn)
    .replace('{p}', String(e.z))
    .replace('{n}', String(neutrons))
    .replace('{shells}', shells.join('.'))

  return (
    <div className="relative flex flex-col justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_45%,#1e3a5f_0%,#0b1324_55%,#050810_100%)] text-white">
      {/* faint stars */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(1px_1px_at_20%_30%,#fff,transparent),radial-gradient(1px_1px_at_70%_20%,#fff,transparent),radial-gradient(1px_1px_at_85%_70%,#fff,transparent),radial-gradient(1px_1px_at_35%_80%,#fff,transparent),radial-gradient(1px_1px_at_55%_55%,#fff,transparent)]"
      />

      <div className="absolute top-3 left-4 z-10 md:top-5 md:left-6">
        <p className="text-3xl leading-none font-bold md:text-4xl">{e.symbol}</p>
        <p className="mt-1 font-mono text-xs text-cyan-200/80">{shells.join('.')}</p>
      </div>
      <div className="mx-auto w-full max-w-[380px] px-4 pt-10 md:max-w-[480px] md:pt-12">
        <AtomModel protons={e.z} neutrons={neutrons} shells={shells} label={label} />
      </div>

      <div className="relative px-4 pb-3 md:pb-5">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs">
          <Legend color="bg-rose-500" text={`${a.protons} ${e.z}`} />
          <Legend color="bg-slate-400" text={`${a.neutrons} ${neutrons}`} />
          <Legend color="bg-cyan-400 shadow-[0_0_8px_#22d3ee]" text={`${a.electrons} ${e.electrons}`} />
        </div>
        <p className="mt-1.5 text-center text-[0.65rem] text-slate-400 md:text-xs">
          {a.drag} · {a.note}
        </p>
        <p aria-hidden className="mt-1 animate-bounce text-center text-xs text-slate-300 md:hidden">
          ↓ {a.scroll}
        </p>
      </div>
    </div>
  )
}

function Legend({ color, text }: { color: string; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-slate-200">
      <span aria-hidden className={`h-2.5 w-2.5 rounded-full ${color}`} />
      {text}
    </span>
  )
}

function Fact({ label, value, note, className = '' }: { label: string; value: ReactNode; note?: string; className?: string }) {
  return (
    <div className={`rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/60 ${className}`}>
      <dt className="text-xs text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="mt-0.5 text-lg font-semibold tabular-nums">{value}</dd>
      {note && <dd className="text-xs text-slate-500 dark:text-slate-400">{note}</dd>}
    </div>
  )
}
