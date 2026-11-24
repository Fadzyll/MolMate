import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import en, { type Dictionary } from './en'
import ms from './ms'

export type Language = 'en' | 'ms'

const dictionaries: Record<Language, Dictionary> = { en, ms }
const STORAGE_KEY = 'molmate-lang'

interface LanguageContextValue {
  lang: Language
  setLang: (lang: Language) => void
  t: Dictionary
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

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

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider')
  return ctx
}
