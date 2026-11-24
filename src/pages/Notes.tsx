import { Link } from 'react-router-dom'
import { Sym } from '../components/ui/Num'
import { getMistakes, getNotes, getWorkedExamples } from '../content/notes'
import { useLanguage } from '../i18n/useLanguage'

export default function Notes() {
  const { t, lang } = useLanguage()
  const notes = getNotes(lang)
  const mistakes = getMistakes(lang)
  const examples = getWorkedExamples(lang)

  const toc = [
    ...notes.map((n) => ({ id: n.id, title: n.title })),
    { id: 'mistakes', title: t.notes.mistakesTitle },
    { id: 'worked', title: t.notes.workedTitle },
  ]

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">{t.notes.title}</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">{t.notes.subtitle}</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        {/* Contents: chips on phones, sticky sidebar on desktop */}
        <nav aria-label={t.notes.contents} className="lg:sticky lg:top-24 lg:self-start">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {t.notes.contents}
          </p>
          <ul className="flex flex-wrap gap-1.5 lg:flex-col lg:gap-0.5">
            {toc.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="block rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 hover:border-teal-600 hover:text-teal-800 lg:rounded-lg lg:border-0 lg:bg-transparent lg:px-2 lg:py-1.5 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-teal-300 lg:dark:bg-transparent"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0 space-y-6">
          {notes.map((note) => (
            <article
              key={note.id}
              id={note.id}
              className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold">{note.title}</h2>
                {note.tag && (
                  <span className="rounded-md bg-orange-100 px-2 py-0.5 text-sm font-semibold text-orange-900 dark:bg-orange-900/40 dark:text-orange-200">
                    {note.tag.includes('_') ? <Sym s={note.tag} /> : note.tag}
                  </span>
                )}
              </div>

              <p className="mt-3 text-[1.05rem] leading-relaxed text-pretty">{note.definition}</p>

              {note.points && (
                <div className="mt-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {t.notes.keyPoints}
                  </h3>
                  <ul className="mt-1.5 list-disc space-y-1 pl-5 text-slate-700 marker:text-teal-600 dark:text-slate-300">
                    {note.points.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}

              {note.example && (
                <div className="mt-4 rounded-xl border-l-4 border-teal-600 bg-teal-50 px-4 py-3 dark:bg-teal-950/30">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-teal-800 dark:text-teal-300">
                    {t.notes.example}
                  </h3>
                  <p className="mt-1 leading-relaxed">{note.example}</p>
                </div>
              )}
            </article>
          ))}

          <section
            id="mistakes"
            className="scroll-mt-24 rounded-2xl border border-amber-300 bg-amber-50 p-5 sm:p-6 dark:border-amber-800 dark:bg-amber-950/30"
          >
            <h2 className="text-xl font-bold">⚠️ {t.notes.mistakesTitle}</h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 marker:text-amber-600">
              {mistakes.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </section>

          <section id="worked" className="scroll-mt-24 space-y-4">
            <div>
              <h2 className="text-2xl font-bold">{t.notes.workedTitle}</h2>
              <p className="mt-1 text-slate-600 dark:text-slate-400">{t.notes.workedIntro}</p>
            </div>
            {examples.map((ex, i) => (
              <article
                key={ex.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {t.notes.question} {i + 1}
                </p>
                <p className="mt-1 font-medium">{ex.question}</p>
                <details className="group mt-3">
                  <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 rounded-lg border border-teal-700 px-3 py-1.5 text-sm font-medium text-teal-800 hover:bg-teal-50 dark:border-teal-500 dark:text-teal-300 dark:hover:bg-teal-950 [&::-webkit-details-marker]:hidden">
                    <span className="transition-transform group-open:rotate-90" aria-hidden>
                      ▸
                    </span>
                    <span className="group-open:hidden">{t.notes.showSolution}</span>
                    <span className="hidden group-open:inline">{t.notes.hideSolution}</span>
                  </summary>
                  <ol className="mt-3 space-y-1.5 border-l-2 border-slate-200 pl-4 dark:border-slate-700">
                    {ex.steps.map((s, j) => (
                      <li key={j}>{s}</li>
                    ))}
                  </ol>
                  <p className="mt-3 rounded-lg bg-orange-50 px-3 py-2 font-semibold dark:bg-orange-950/30">
                    {t.notes.answer}: {ex.answer}
                  </p>
                  <Link
                    to={`/calculator?tab=${ex.tab}`}
                    className="mt-3 inline-block text-sm font-medium text-teal-700 hover:underline dark:text-teal-400"
                  >
                    {t.notes.tryIt} →
                  </Link>
                </details>
              </article>
            ))}
          </section>
        </div>
      </div>
    </div>
  )
}
