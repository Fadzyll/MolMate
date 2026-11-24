import { parseNumber } from '../../lib/format'

export interface FieldValue {
  /** Main text box (or the coefficient in scientific mode). */
  text: string
  /** Power of ten, scientific mode only. */
  exponent: string
}

export const emptyField: FieldValue = { text: '', exponent: '' }

/** Combine the boxes into one string for parseNumber(). */
export function fieldToString(f: FieldValue): string {
  const exp = f.exponent.trim()
  return exp ? `${f.text.trim() || '1'} x 10^${exp}` : f.text
}

export type Parsed = { ok: true; value: number } | { ok: false; error: 'invalid' | 'notPositive' | null }

/** Parse a field; empty fields are not an error, just not ready. */
export function parseField(field: FieldValue): Parsed {
  if (!field.text.trim() && !field.exponent.trim()) return { ok: false, error: null }
  const n = parseNumber(fieldToString(field))
  if (n === null) return { ok: false, error: 'invalid' }
  if (n <= 0) return { ok: false, error: 'notPositive' }
  return { ok: true, value: n }
}
