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
