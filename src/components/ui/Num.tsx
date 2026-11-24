import { formatNumber, type FormatOptions } from '../../lib/format'

/** A number in textbook style: plain, or "a × 10ⁿ" with a real superscript. */
export function Num({ value, ...options }: { value: number } & FormatOptions) {
  const { coefficient, exponent } = formatNumber(value, options)
  if (exponent === null) return <span className="tabular-nums">{coefficient}</span>
  return (
    <span className="whitespace-nowrap tabular-nums">
      {coefficient} × 10<sup>{exponent}</sup>
    </span>
  )
}

/** A symbol such as "N_A" or "V_m", rendered with a subscript. */
export function Sym({ s }: { s: string }) {
  const [main, sub] = s.split('_')
  return (
    <span className="font-serif italic">
      {main}
      {sub && <sub className="not-italic">{sub}</sub>}
    </span>
  )
}
