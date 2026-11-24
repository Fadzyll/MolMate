import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/useLanguage'

export default function NotFound() {
  const { t } = useLanguage()
  return (
    <section className="py-16 text-center">
      <p className="text-6xl font-extrabold text-teal-700 dark:text-teal-400">404</p>
      <h1 className="mt-4 text-2xl font-bold">{t.notFound.title}</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">{t.notFound.text}</p>
      <Link to="/" className="mt-6 inline-block font-semibold text-teal-700 hover:underline dark:text-teal-400">
        ← {t.notFound.back}
      </Link>
    </section>
  )
}
