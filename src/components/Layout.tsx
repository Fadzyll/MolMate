import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useLanguage } from '../i18n/useLanguage'
import Navbar from './Navbar'

const TITLE_KEYS = {
  '/calculator': 'calculator',
  '/notes': 'notes',
  '/formulas': 'formulas',
  '/units': 'units',
  '/periodic-table': 'periodicTable',
} as const

export default function Layout() {
  const { t } = useLanguage()
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  // Browser tab title, e.g. "Calculator · MolMate".
  useEffect(() => {
    const key = TITLE_KEYS[pathname as keyof typeof TITLE_KEYS]
    document.title = key ? `${t.nav[key]} · ${t.appName}` : `${t.appName} — ${t.tagline}`
  }, [pathname, t])

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only z-50 rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {t.skipToContent}
      </a>
      <Navbar />
      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 outline-none sm:py-12">
        <Suspense
          fallback={
            <p role="status" className="min-h-[100dvh] py-16 text-center text-slate-500 dark:text-slate-400">
              {t.loading}
            </p>
          }
        >
          <Outlet />
        </Suspense>
      </main>
      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500 print:hidden dark:border-slate-800 dark:text-slate-400">
        <p className="px-4">
          {t.appName} · {t.footer.text}
        </p>
        <p className="mt-1 px-4">{t.footer.credit}</p>
      </footer>
    </div>
  )
}
