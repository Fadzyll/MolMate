/**
 * Renders a chemical formula with subscripts: H2SO4 → H₂SO₄, CuSO4·5H2O → CuSO₄·5H₂O.
 * Digits after an element or closing bracket are subscripts; a number right
 * after the hydrate dot (or at the start) is a normal-size coefficient.
 */
export function Formula({ text }: { text: string }) {
  const parts = text.match(/\d+|[^\d]+/g) ?? []
  return (
    <span className="whitespace-nowrap">
      {parts.map((p, i) => {
        const prev = i > 0 ? parts[i - 1] : ''
        const isDigits = /^\d/.test(p)
        const isCoefficient = isDigits && (prev === '' || prev.endsWith('·'))
        return isDigits && !isCoefficient ? <sub key={i}>{p}</sub> : <span key={i}>{p}</span>
      })}
    </span>
  )
}
