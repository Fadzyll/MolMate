/**
 * Number formatting and parsing for chemistry answers.
 * Very large or small numbers are shown as "a × 10ⁿ", like the textbook.
 */

export interface FormattedNumber {
  /** e.g. "1.2" */
  coefficient: string
  /** e.g. 24 for × 10²⁴; null when shown as a plain number */
  exponent: number | null
}

export interface FormatOptions {
  /** Significant figures (default 3). */
  sigFigs?: number
  /** Drop trailing zeros, so 0.200 shows as 0.2 (default true). */
  trimZeros?: boolean
}

const SCI_UPPER = 1e4
const SCI_LOWER = 1e-3

function trim(s: string): string {
  return s.includes('.') ? s.replace(/\.?0+$/, '') : s
}

export function formatNumber(value: number, { sigFigs = 3, trimZeros = true }: FormatOptions = {}): FormattedNumber {
  if (!Number.isFinite(value)) return { coefficient: '—', exponent: null }
  if (value === 0) return { coefficient: '0', exponent: null }

  const abs = Math.abs(value)
  if (abs >= SCI_UPPER || abs < SCI_LOWER) {
    const [mantissa, exp] = value.toExponential(sigFigs - 1).split('e')
    return { coefficient: trimZeros ? trim(mantissa) : mantissa, exponent: Number(exp) }
  }

  // toPrecision can itself return exponential form (e.g. 1234 at 2 s.f.); Number() normalises it.
  let s = value.toPrecision(sigFigs)
  if (s.includes('e')) s = String(Number(s))
  return { coefficient: trimZeros ? trim(s) : s, exponent: null }
}

const SUPERSCRIPT: Record<string, string> = {
  '-': '⁻',
  '0': '⁰',
  '1': '¹',
  '2': '²',
  '3': '³',
  '4': '⁴',
  '5': '⁵',
  '6': '⁶',
  '7': '⁷',
  '8': '⁸',
  '9': '⁹',
}

export function toSuperscript(n: number): string {
  return String(n)
    .split('')
    .map((c) => SUPERSCRIPT[c] ?? c)
    .join('')
}

/** Plain-text form for copying, e.g. "1.2 × 10²⁴". */
export function formatText(value: number, options?: FormatOptions): string {
  const { coefficient, exponent } = formatNumber(value, options)
  return exponent === null ? coefficient : `${coefficient} × 10${toSuperscript(exponent)}`
}

const SUPERSCRIPT_REVERSE: Record<string, string> = Object.fromEntries(
  Object.entries(SUPERSCRIPT).map(([k, v]) => [v, k]),
)

/**
 * Parse what a student types. Accepts:
 *   "0.5", ".5", "1,000" (thousands), "6.02e23", "6.02E23",
 *   "6.02 x 10^23", "6.02×10^23", "6.02*10^23", "6.02 × 10²³", "10^23"
 * Returns null when the text is not a number.
 */
export function parseNumber(input: string): number | null {
  let s = input.trim().replace(/\s+/g, '')
  if (!s) return null

  // Unicode superscript exponent → ^n
  s = s.replace(/10([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)/g, (_, sup: string) => '10^' + [...sup].map((c) => SUPERSCRIPT_REVERSE[c]).join(''))
  s = s.replace(/−/g, '-') // typographic minus

  // Thousands separators: only when every group after a comma has exactly 3 digits.
  if (/^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(s)) s = s.replace(/,/g, '')

  const sci = s.match(/^(-?(?:\d+\.?\d*|\.\d+))?(?:[x×*·])?10\^(-?\d+)$/i)
  if (sci) {
    // Build "6.02e23" and let Number() parse it, so the value is exactly what was typed.
    const n = Number(`${sci[1] ?? '1'}e${sci[2]}`)
    return Number.isFinite(n) ? n : null
  }

  if (!/^-?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i.test(s)) return null
  const n = Number(s)
  return Number.isFinite(n) ? n : null
}
