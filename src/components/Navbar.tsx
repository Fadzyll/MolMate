import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useLanguage, type Language } from '../i18n/useLanguage'
import { useTheme } from '../lib/theme'

const links = [
  { to: '/', key: 'home' },
  { to: '/calculator', key: 'calculator' },
  { to: '/notes', key: 'notes' },
  { to: '/formulas', key: 'formulas' },
  { to: '/units', key: 'units' },
  { to: '/periodic-table', key: 'periodicTable' },
] as const

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-teal-50 text-teal-800 dark:bg-teal-900/40 dark:text-teal-200'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
  }`

export default function Navbar() {
  const { t, lang, setLang } = useLanguage()
  const { theme, toggle } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <header className="print:hidden sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
      <nav className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4">
        <Link to="/" className="mr-auto flex items-center gap-2" onClick={() => setOpen(false)}>
          <img src="/favicon.svg" alt="" className="h-8 w-8" />
          <span className="text-lg font-bold tracking-tight">{t.appName}</span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={linkClass}>
              {t.nav[l.key]}
            </NavLink>
          ))}
        </div>

        <LanguageSwitch lang={lang} setLang={setLang} label={t.toggle.language} />

        <button
          type="button"
          onClick={toggle}
          aria-label={theme === 'dark' ? t.toggle.themeToLight : t.toggle.themeToDark}
          title={theme === 'dark' ? t.toggle.themeToLight : t.toggle.themeToDark}
          className="grid h-9 w-9 place-items-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={t.nav.menu}
          aria-expanded={open}
          className="grid h-9 w-9 place-items-center rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <MenuIcon open={open} />
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-200 px-4 py-2 lg:hidden dark:border-slate-800">
          <div className="mx-auto flex max-w-6xl flex-col">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'} className={linkClass} onClick={() => setOpen(false)}>
                {t.nav[l.key]}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

function LanguageSwitch({
  lang,
  setLang,
  label,
}: {
  lang: Language
  setLang: (l: Language) => void
  label: string
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex rounded-lg border border-slate-200 p-0.5 text-xs font-semibold dark:border-slate-700"
    >
      {(['en', 'ms'] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={`rounded-md px-2 py-1 uppercase transition-colors ${
            lang === code
              ? 'bg-teal-700 text-white'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          {code === 'en' ? 'EN' : 'BM'}
        </button>
      ))}
    </div>
  )
}

const iconProps = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

function SunIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg {...iconProps}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function MenuIcon({ open }: { open: boolean }) {
  return <svg {...iconProps}>{open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}</svg>
}
