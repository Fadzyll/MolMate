import { useSearchParams } from 'react-router-dom'
import ChainCalculator from '../components/calculator/ChainCalculator'
import RelationCalculator from '../components/calculator/RelationCalculator'
import type { RelationId } from '../components/calculator/relations'
import { useLanguage } from '../i18n/useLanguage'

type TabId = RelationId | 'chain'

const TABS: { id: TabId; color: string }[] = [
  { id: 'particles', color: 'bg-particles' },
  { id: 'mass', color: 'bg-mass' },
  { id: 'volume', color: 'bg-volume' },
  { id: 'chain', color: 'bg-mole' },
]

function isTab(v: string | null): v is TabId {
  return TABS.some((tab) => tab.id === v)
}

export default function Calculator() {
  const { t } = useLanguage()
  const [params, setParams] = useSearchParams()
  const raw = params.get('tab')
  const tab: TabId = isTab(raw) ? raw : 'particles'
  // Set by "Use in calculator" on the periodic table, e.g. ?tab=mass&formula=Na
  const formula = params.get('formula') ?? ''

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">{t.calc.title}</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">{t.calc.subtitle}</p>
      </header>

      <div
        role="tablist"
        aria-label={t.calc.title}
        className="grid grid-cols-2 gap-1 rounded-xl sm:grid-cols-4 bg-slate-200/70 p-1 dark:bg-slate-800"
      >
        {TABS.map(({ id, color }) => {
          const active = id === tab
          return (
            <button
              key={id}
              type="button"
              role="tab"
              id={`tab-${id}`}
              aria-selected={active}
              aria-controls="calc-panel"
              onClick={() => setParams({ tab: id }, { replace: true })}
              className={`flex items-center justify-center gap-2 rounded-lg px-2 py-2.5 text-xs font-semibold transition sm:text-sm ${
                active
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <span aria-hidden className={`hidden h-2.5 w-2.5 shrink-0 rounded-full sm:inline-block ${color}`} />
              {t.calc.tabs[id]}
            </button>
          )
        })}
      </div>

      <div id="calc-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
        {/* key resets the calculator's inputs when switching tabs */}
        {tab === 'chain' ? <ChainCalculator /> : <RelationCalculator key={`${tab}-${formula}`} id={tab} initialFormula={formula} />}
      </div>
    </div>
  )
}
