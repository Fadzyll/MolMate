import { useState, type ReactNode } from 'react'
import { CATEGORY_ORDER, CATEGORY_STYLE, gridPosition, jarText, matchesSearch } from '../components/periodic/categories'
import ElementDialog from '../components/periodic/ElementDialog'
import Segmented from '../components/ui/Segmented'
import { ELEMENTS, type Category, type Element } from '../data/elements'
import { useLanguage } from '../i18n/useLanguage'

type View = 'grid' | 'list'
type SortKey = 'z' | 'name' | 'jar'

const VIEW_KEY = 'molmate-pt-view'

function initialView(): View {
  try {
    const saved = localStorage.getItem(VIEW_KEY)
    if (saved === 'grid' || saved === 'list') return saved
  } catch {
    // ignore
  }
  // Phones start on the list; the full table needs a wide screen.
  return window.matchMedia('(min-width: 768px)').matches ? 'grid' : 'list'
}

export default function PeriodicTable() {
  const { t, lang } = useLanguage()
  const [view, setView] = useState<View>(initialView)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Category | null>(null)
  const [selected, setSelected] = useState<Element | null>(null)
  const [sort, setSort] = useState<{ key: SortKey; asc: boolean }>({ key: 'z', asc: true })

  const name = (e: Element) => (lang === 'ms' ? e.nameMs : e.nameEn)
  const isMatch = (e: Element) => matchesSearch(e, query) && (category === null || e.category === category)
  const matchCount = ELEMENTS.filter(isMatch).length

  const changeView = (v: View) => {
    setView(v)
    try {
      localStorage.setItem(VIEW_KEY, v)
    } catch {
      // ignore
    }
  }

  const sorted = [...ELEMENTS]
  const dir = sort.asc ? 1 : -1
  sorted.sort((a, b) => {
    if (sort.key === 'name') return dir * name(a).localeCompare(name(b))
    if (sort.key === 'jar') return dir * (a.jar - b.jar)
    return dir * (a.z - b.z)
  })

  const toggleSort = (key: SortKey) => setSort((s) => (s.key === key ? { key, asc: !s.asc } : { key, asc: true }))

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">{t.pt.title}</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">{t.pt.subtitle}</p>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <svg
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.pt.search}
            aria-label={t.pt.search}
            className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pr-3 pl-10 text-base shadow-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-900 dark:focus:ring-teal-900"
          />
        </div>
        <Segmented<View>
          label={t.pt.grid}
          value={view}
          onChange={changeView}
          options={[
            { value: 'grid', label: t.pt.grid },
            { value: 'list', label: t.pt.list },
          ]}
        />
      </div>

      {/* Category legend doubles as a filter */}
      <div role="group" aria-label={t.pt.legend} className="flex flex-wrap gap-1.5">
        <LegendChip active={category === null} onClick={() => setCategory(null)}>
          {t.pt.all}
        </LegendChip>
        {CATEGORY_ORDER.map((c) => (
          <LegendChip key={c} active={category === c} onClick={() => setCategory(category === c ? null : c)}>
            <span aria-hidden className={`h-2.5 w-2.5 rounded-full ${CATEGORY_STYLE[c].dot}`} />
            {t.pt.categories[c]}
          </LegendChip>
        ))}
      </div>

      {matchCount === 0 && (
        <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-slate-500 dark:border-slate-700">
          {t.pt.noResults}
        </p>
      )}

      {view === 'grid' ? (
        <div>
          <p className="mb-2 text-xs text-slate-500 lg:hidden dark:text-slate-400">{t.pt.scrollHint}</p>
          <div className="-mx-4 overflow-x-auto px-4 pb-2">
            <div
              className="grid min-w-[860px] gap-1"
              style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))', gridTemplateRows: 'repeat(7, auto) 0.75rem auto auto' }}
            >
              {ELEMENTS.map((e) => {
                const { row, col } = gridPosition(e)
                const match = isMatch(e)
                return (
                  <button
                    key={e.z}
                    type="button"
                    onClick={() => setSelected(e)}
                    style={{ gridRow: row, gridColumn: col }}
                    aria-label={`${name(e)}, ${t.pt.col.z} ${e.z}, ${t.pt.col.jar} ${jarText(e)}`}
                    className={`aspect-square rounded-md border p-1 text-left leading-none transition hover:z-10 hover:scale-110 hover:shadow-lg focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-teal-600 ${
                      CATEGORY_STYLE[e.category].tile
                    } ${match ? '' : 'opacity-20'}`}
                  >
                    <span className="block text-[0.6rem] opacity-75">{e.z}</span>
                    <span className="mt-0.5 block text-center text-base font-bold xl:text-lg">{e.symbol}</span>
                    <span className="mt-0.5 block text-center text-[0.6rem] tabular-nums opacity-80">{jarText(e)}</span>
                  </button>
                )
              })}
              {/* f-block placeholders in group 3 */}
              {[
                { row: 6, label: '57–71', c: 'lanthanide' as const },
                { row: 7, label: '89–103', c: 'actinide' as const },
              ].map((p) => (
                <div
                  key={p.row}
                  style={{ gridRow: p.row, gridColumn: 3 }}
                  className={`grid aspect-square place-items-center rounded-md border border-dashed text-[0.6rem] font-medium ${
                    CATEGORY_STYLE[p.c].tile
                  } ${category === null || category === p.c ? '' : 'opacity-20'}`}
                >
                  {p.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
              <tr>
                <SortHeader label={t.pt.col.z} shortLabel="Z" active={sort.key === 'z'} asc={sort.asc} onClick={() => toggleSort('z')} />
                <SortHeader label={t.pt.col.name} active={sort.key === 'name'} asc={sort.asc} onClick={() => toggleSort('name')} />
                <SortHeader
                  label={t.pt.col.jar}
                  active={sort.key === 'jar'}
                  asc={sort.asc}
                  onClick={() => toggleSort('jar')}
                  align="right"
                />
                <th className="px-2 py-2 sm:px-3 text-right font-medium">{t.pt.col.electrons}</th>
                <th className="hidden px-2 py-2 sm:px-3 text-right font-medium sm:table-cell">{t.pt.col.group}</th>
                <th className="hidden px-2 py-2 sm:px-3 text-right font-medium sm:table-cell">{t.pt.col.period}</th>
                <th className="hidden px-2 py-2 sm:px-3 font-medium md:table-cell">{t.pt.col.category}</th>
              </tr>
            </thead>
            <tbody>
              {sorted.filter(isMatch).map((e) => (
                <tr
                  key={e.z}
                  onClick={() => setSelected(e)}
                  className="cursor-pointer border-t border-slate-100 hover:bg-teal-50/60 dark:border-slate-800 dark:hover:bg-teal-950/30"
                >
                  <td className="px-2 py-2 sm:px-3 tabular-nums text-slate-500 dark:text-slate-400">{e.z}</td>
                  <td className="px-2 py-2 sm:px-3">
                    <button
                      type="button"
                      onClick={(ev) => {
                        ev.stopPropagation()
                        setSelected(e)
                      }}
                      className="flex items-center gap-2 text-left"
                    >
                      <span
                        className={`grid h-7 w-7 shrink-0 place-items-center rounded-md border text-xs font-bold sm:h-8 sm:w-8 sm:text-sm ${
                          CATEGORY_STYLE[e.category].tile
                        }`}
                      >
                        {e.symbol}
                      </span>
                      <span className="font-medium break-words">{name(e)}</span>
                    </button>
                  </td>
                  <td className="px-2 py-2 sm:px-3 text-right font-semibold tabular-nums">{jarText(e)}</td>
                  <td className="px-2 py-2 sm:px-3 text-right tabular-nums">{e.electrons}</td>
                  <td className="hidden px-2 py-2 sm:px-3 text-right tabular-nums sm:table-cell">{e.group ?? '—'}</td>
                  <td className="hidden px-2 py-2 sm:px-3 text-right tabular-nums sm:table-cell">{e.period}</td>
                  <td className="hidden px-2 py-2 sm:px-3 md:table-cell">{t.pt.categories[e.category]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-slate-500 dark:text-slate-400">{t.pt.jarNote}</p>

      <ElementDialog element={selected} onClose={() => setSelected(null)} />
    </div>
  )
}

function LegendChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
        active
          ? 'border-teal-700 bg-teal-700 text-white'
          : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
      }`}
    >
      {children}
    </button>
  )
}

function SortHeader({
  label,
  shortLabel,
  active,
  asc,
  onClick,
  align = 'left',
}: {
  label: string
  /** Shorter label for phones. */
  shortLabel?: string
  active: boolean
  asc: boolean
  onClick: () => void
  align?: 'left' | 'right'
}) {
  return (
    <th className={`px-2 py-2 sm:px-3 font-medium ${align === 'right' ? 'text-right' : ''}`} aria-sort={active ? (asc ? 'ascending' : 'descending') : 'none'}>
      <button type="button" onClick={onClick} className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white">
        {shortLabel ? (
          <>
            <span className="sm:hidden" title={label}>
              {shortLabel}
            </span>
            <span className="hidden sm:inline">{label}</span>
          </>
        ) : (
          label
        )}
        <span aria-hidden className={active ? '' : 'opacity-30'}>
          {active && !asc ? '▼' : '▲'}
        </span>
      </button>
    </th>
  )
}
