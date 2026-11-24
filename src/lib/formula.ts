import { getElement, type Category } from '../data/elements'

/**
 * Parses chemical formulas such as H2O, Ca(OH)2, Al2(SO4)3, K4[Fe(CN)6]
 * and hydrates like CuSO4·5H2O, and works out the relative molecular mass
 * (JMR/RMM) or relative formula mass (JFR/RFM) from SPM JAR values.
 */

export type FormulaErrorCode =
  | 'empty'
  | 'unknownElement'
  | 'lowercaseStart'
  | 'unexpectedChar'
  | 'unmatchedOpen'
  | 'unmatchedClose'
  | 'emptyGroup'
  | 'misplacedNumber'

export class FormulaError extends Error {
  code: FormulaErrorCode
  /** The offending symbol or character, when there is one. */
  detail: string
  constructor(code: FormulaErrorCode, detail = '') {
    super(`${code}${detail ? `: ${detail}` : ''}`)
    this.name = 'FormulaError'
    this.code = code
    this.detail = detail
  }
}

export interface BreakdownItem {
  symbol: string
  count: number
  jar: number
  subtotal: number
}

export interface FormulaResult {
  /** The cleaned-up formula, e.g. "CuSO4·5H2O". */
  formula: string
  breakdown: BreakdownItem[]
  /** Relative mass; numerically equal to the molar mass in g mol⁻¹. */
  total: number
  /**
   * 'atom' for a single atom (JAR), 'ionic' when the formula contains a metal
   * or the ammonium ion (JFR), otherwise 'molecular' (JMR).
   */
  kind: 'atom' | 'molecular' | 'ionic'
}

const SUBSCRIPT_DIGITS: Record<string, string> = {
  '₀': '0',
  '₁': '1',
  '₂': '2',
  '₃': '3',
  '₄': '4',
  '₅': '5',
  '₆': '6',
  '₇': '7',
  '₈': '8',
  '₉': '9',
}

const METALS: ReadonlySet<Category> = new Set([
  'alkali',
  'alkalineEarth',
  'transition',
  'postTransition',
  'lanthanide',
  'actinide',
])

const CLOSE_FOR: Record<string, string> = { '(': ')', '[': ']' }

/** Normalise what a student types: drop spaces, convert ₂ to 2, unify hydrate dots. */
export function normaliseFormula(input: string): string {
  return input
    .replace(/\s+/g, '')
    .replace(/[₀-₉]/g, (c) => SUBSCRIPT_DIGITS[c])
    .replace(/[.•∙*⋅]/g, '·')
}

type Counts = Map<string, number>

function add(into: Counts, from: Counts, times = 1) {
  for (const [sym, n] of from) into.set(sym, (into.get(sym) ?? 0) + n * times)
}

/** Count atoms in a formula without hydrate dots. */
function countAtoms(s: string): Counts {
  let i = 0

  const readNumber = (): number | null => {
    const start = i
    while (i < s.length && s[i] >= '0' && s[i] <= '9') i++
    return i > start ? Number(s.slice(start, i)) : null
  }

  const parseGroup = (close: string | null): Counts => {
    const counts: Counts = new Map()
    while (i < s.length) {
      const c = s[i]

      if (c >= 'A' && c <= 'Z') {
        let symbol = c
        i++
        if (i < s.length && s[i] >= 'a' && s[i] <= 'z') symbol += s[i++]
        if (!getElement(symbol)) throw new FormulaError('unknownElement', symbol)
        add(counts, new Map([[symbol, readNumber() ?? 1]]))
      } else if (c === '(' || c === '[') {
        i++
        const inner = parseGroup(CLOSE_FOR[c])
        if (inner.size === 0) throw new FormulaError('emptyGroup', c + CLOSE_FOR[c])
        add(counts, inner, readNumber() ?? 1)
      } else if (c === ')' || c === ']') {
        if (c !== close) throw new FormulaError('unmatchedClose', c)
        i++
        return counts
      } else if (c >= 'a' && c <= 'z') {
        throw new FormulaError('lowercaseStart', c)
      } else if (c >= '0' && c <= '9') {
        throw new FormulaError('misplacedNumber', c)
      } else {
        throw new FormulaError('unexpectedChar', c)
      }
    }
    if (close) throw new FormulaError('unmatchedOpen', close === ')' ? '(' : '[')
    return counts
  }

  return parseGroup(null)
}

export function parseFormula(input: string): FormulaResult {
  const formula = normaliseFormula(input)
  if (!formula) throw new FormulaError('empty')

  const counts: Counts = new Map()
  for (const [index, part] of formula.split('·').entries()) {
    if (!part) throw new FormulaError('unexpectedChar', '·')
    // Only a hydrate part may start with a coefficient: the 5 in ·5H2O.
    // "2H2O" is rejected, since the molar mass of water is still 18.
    const m = part.match(/^(\d+)(.*)$/)
    if (m && index === 0) throw new FormulaError('misplacedNumber', m[1])
    const multiplier = m ? Number(m[1]) : 1
    const body = m ? m[2] : part
    if (!body) throw new FormulaError('misplacedNumber', part)
    add(counts, countAtoms(body), multiplier)
  }

  const breakdown: BreakdownItem[] = [...counts].map(([symbol, count]) => {
    const jar = getElement(symbol)!.jar
    return { symbol, count, jar, subtotal: count * jar }
  })
  // Round away floating-point noise from values like 35.5 × 3.
  const total = Math.round(breakdown.reduce((sum, b) => sum + b.subtotal, 0) * 1000) / 1000

  const isSingleAtom = breakdown.length === 1 && breakdown[0].count === 1
  const hasMetal = breakdown.some((b) => METALS.has(getElement(b.symbol)!.category))
  const hasAmmonium = /NH4/.test(formula)
  const kind = isSingleAtom ? 'atom' : hasMetal || hasAmmonium ? 'ionic' : 'molecular'

  return { formula, breakdown, total, kind }
}

/** Like parseFormula, but returns the error instead of throwing. */
export function tryParseFormula(input: string): { ok: true; result: FormulaResult } | { ok: false; error: FormulaError } {
  try {
    return { ok: true, result: parseFormula(input) }
  } catch (e) {
    if (e instanceof FormulaError) return { ok: false, error: e }
    throw e
  }
}

/** The working line students write, e.g. "2(1) + 16 = 18". */
export function breakdownText(result: FormulaResult): string {
  const terms = result.breakdown.map((b) => (b.count === 1 ? `${b.jar}` : `${b.count}(${b.jar})`))
  return `${terms.join(' + ')} = ${result.total}`
}
