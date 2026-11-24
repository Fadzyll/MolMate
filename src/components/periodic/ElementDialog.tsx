import { useEffect, useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { Element } from '../../data/elements'
import { useLanguage } from '../../i18n/useLanguage'
import { CATEGORY_STYLE, jarText } from './categories'

/** Element details in a native modal dialog (Escape and backdrop click close it). */
export default function ElementDialog({ element, onClose }: { element: Element | null; onClose: () => void }) {
  const { t, lang } = useLanguage()
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (element && !dialog.open) dialog.showModal()
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
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/60 dark:bg-slate-900 dark:text-slate-100"
    >
      {e && (
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div
              className={`grid h-20 w-20 shrink-0 place-items-center rounded-xl border-2 ${CATEGORY_STYLE[e.category].tile}`}
            >
              <div className="text-center leading-none">
                <div className="text-xs font-medium opacity-75">{e.z}</div>
                <div className="mt-1 text-3xl font-bold">{e.symbol}</div>
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
            <button
              type="button"
              onClick={onClose}
              aria-label={d.close}
              className="-mt-1 -mr-1 grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-3">
            <Fact label={d.protonNumber} value={e.z} />
            <Fact label={d.electrons} value={e.electrons} />
            <Fact label={d.jar} value={jarText(e)} />
            <Fact label={d.molarMass} value={`${e.jar} g mol⁻¹`} />
            <Fact label={d.group} value={e.group ?? d.fBlock} />
            <Fact label={d.period} value={e.period} />
            <div className="col-span-2">
              <Fact
                label={d.arrangement}
                value={e.electronArrangement ?? '—'}
                note={e.electronArrangement ? undefined : d.arrangementNote}
              />
            </div>
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
      )}
    </dialog>
  )
}

function Fact({ label, value, note }: { label: string; value: ReactNode; note?: string }) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
      <dt className="text-xs text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="mt-0.5 text-lg font-semibold tabular-nums">{value}</dd>
      {note && <dd className="text-xs text-slate-500 dark:text-slate-400">{note}</dd>}
    </div>
  )
}
