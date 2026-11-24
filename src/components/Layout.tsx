import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import Navbar from './Navbar'

export default function Layout() {
  const { t } = useLanguage()
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:py-12">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <p className="px-4">
          {t.appName} · {t.footer.text}
        </p>
        <p className="mt-1 px-4">{t.footer.credit}</p>
      </footer>
    </div>
  )
}
