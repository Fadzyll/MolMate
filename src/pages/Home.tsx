import { Link } from 'react-router-dom'
import RajahDiagram from '../components/RajahDiagram'
import { useLanguage } from '../i18n/useLanguage'

const features = [
  { to: '/calculator', key: 'calculator', accent: 'border-t-mole' },
  { to: '/notes', key: 'notes', accent: 'border-t-mass' },
  { to: '/formulas', key: 'formulas', accent: 'border-t-particles' },
  { to: '/units', key: 'units', accent: 'border-t-volume' },
  { to: '/periodic-table', key: 'periodicTable', accent: 'border-t-teal-700' },
] as const

export default function Home() {
  const { t } = useLanguage()

  return (
    <div className="space-y-16">
      <section className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-teal-700 dark:text-teal-400">
          {t.tagline}
        </p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">{t.home.heroTitle}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-pretty text-slate-600 dark:text-slate-400">
          {t.home.heroText}
        </p>
        <Link
          to="/calculator"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-teal-700 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
        >
          {t.home.start} <span aria-hidden>→</span>
        </Link>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-xl font-bold">{t.home.diagramTitle}</h2>
        <p className="mt-1 mb-6 text-slate-600 dark:text-slate-400">{t.home.diagramText}</p>
        <RajahDiagram />
      </section>

      <section>
        <h2 className="mb-5 text-xl font-bold">{t.home.featuresTitle}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Link
              key={f.to}
              to={f.to}
              className={`rounded-xl border border-t-4 border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 ${f.accent}`}
            >
              <h3 className="font-semibold">{t.nav[f.key]}</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t.features[f.key]}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
