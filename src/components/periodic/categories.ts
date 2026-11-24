import type { Category, Element } from '../../data/elements'

/** Tile colours per category, light and dark. Full class strings so Tailwind keeps them. */
export const CATEGORY_STYLE: Record<Category, { tile: string; dot: string }> = {
  alkali: {
    tile: 'bg-red-100 border-red-300 text-red-950 dark:bg-red-950/60 dark:border-red-800 dark:text-red-100',
    dot: 'bg-red-400',
  },
  alkalineEarth: {
    tile: 'bg-orange-100 border-orange-300 text-orange-950 dark:bg-orange-950/60 dark:border-orange-800 dark:text-orange-100',
    dot: 'bg-orange-400',
  },
  transition: {
    tile: 'bg-amber-50 border-amber-300 text-amber-950 dark:bg-amber-950/50 dark:border-amber-800 dark:text-amber-100',
    dot: 'bg-amber-400',
  },
  postTransition: {
    tile: 'bg-emerald-100 border-emerald-300 text-emerald-950 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-100',
    dot: 'bg-emerald-400',
  },
  metalloid: {
    tile: 'bg-teal-100 border-teal-300 text-teal-950 dark:bg-teal-950/60 dark:border-teal-800 dark:text-teal-100',
    dot: 'bg-teal-400',
  },
  nonmetal: {
    tile: 'bg-sky-100 border-sky-300 text-sky-950 dark:bg-sky-950/60 dark:border-sky-800 dark:text-sky-100',
    dot: 'bg-sky-400',
  },
  halogen: {
    tile: 'bg-indigo-100 border-indigo-300 text-indigo-950 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-100',
    dot: 'bg-indigo-400',
  },
  nobleGas: {
    tile: 'bg-violet-100 border-violet-300 text-violet-950 dark:bg-violet-950/60 dark:border-violet-800 dark:text-violet-100',
    dot: 'bg-violet-400',
  },
  lanthanide: {
    tile: 'bg-pink-100 border-pink-300 text-pink-950 dark:bg-pink-950/60 dark:border-pink-800 dark:text-pink-100',
    dot: 'bg-pink-400',
  },
  actinide: {
    tile: 'bg-rose-100 border-rose-300 text-rose-950 dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-100',
    dot: 'bg-rose-400',
  },
}

export const CATEGORY_ORDER: Category[] = [
  'alkali',
  'alkalineEarth',
  'transition',
  'postTransition',
  'metalloid',
  'nonmetal',
  'halogen',
  'nobleGas',
  'lanthanide',
  'actinide',
]

/** RAM as printed: radioactive elements in brackets, e.g. (226). */
export function jarText(e: Element): string {
  return e.radioactive ? `(${e.jar})` : String(e.jar)
}

/** Matches symbol, English or Malay name (partial), or exact proton number. */
export function matchesSearch(e: Element, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  if (/^\d+$/.test(q)) return e.z === Number(q)
  return (
    e.symbol.toLowerCase() === q ||
    e.symbol.toLowerCase().startsWith(q) ||
    e.nameEn.toLowerCase().includes(q) ||
    e.nameMs.toLowerCase().includes(q)
  )
}

/**
 * Grid position (CSS grid row/column, 1-based). Lanthanides and actinides go
 * in rows 9 and 10 below the main table (row 8 is a spacer), starting at column 3.
 */
export function gridPosition(e: Element): { row: number; col: number } {
  if (e.group !== null) return { row: e.period, col: e.group }
  const isLanthanide = e.z >= 57 && e.z <= 71
  return { row: isLanthanide ? 9 : 10, col: 3 + (e.z - (isLanthanide ? 57 : 89)) }
}
