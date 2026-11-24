import { useLanguage } from '../i18n/LanguageContext'

export default function ComingSoon({ title }: { title: string }) {
  const { t } = useLanguage()
  return (
    <section className="mx-auto max-w-xl py-16 text-center">
      <span className="inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-800 dark:bg-orange-900/40 dark:text-orange-200">
        {t.comingSoon}
      </span>
      <h1 className="mt-4 text-3xl font-bold tracking-tight">{title}</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-400">{t.comingSoonText}</p>
    </section>
  )
}
