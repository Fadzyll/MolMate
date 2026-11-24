import { useEffect, useState, type ReactNode } from 'react'
import { LanguageContext, type Language } from './context'
import en, { type Dictionary } from './en'
import ms from './ms'

const dictionaries: Record<Language, Dictionary> = { en, ms }
const STORAGE_KEY = 'molmate-lang'

function readSavedLanguage(): Language {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'ms') return saved
  } catch {
    // Storage unavailable (private mode, blocked) — fall back to the default.
  }
  return 'en'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(readSavedLanguage)

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // Ignore: the choice just won't be remembered.
    }
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: dictionaries[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}
