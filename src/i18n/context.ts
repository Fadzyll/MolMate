import { createContext } from 'react'
import type { Dictionary } from './en'

export type Language = 'en' | 'ms'

export interface LanguageContextValue {
  lang: Language
  setLang: (lang: Language) => void
  t: Dictionary
}

export const LanguageContext = createContext<LanguageContextValue | null>(null)
